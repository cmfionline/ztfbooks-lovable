import * as z from "zod";

export const bookSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  seriesId: z.string().uuid().nullable().optional(),
  languageId: z.string().uuid("Language is required"),
  coverImage: z.any().optional(),
  synopsis: z.string().optional().nullable(),
  authorId: z.string().uuid("Author is required"),
  publisherId: z.string().uuid().nullable().optional(),
  epubFile: z.any().optional(),
  publicationDate: z.date().optional().nullable(),
  pageCount: z.number().int().positive().optional().nullable(),
  isFree: z.boolean().default(false),
  price: z.number().min(0).optional().nullable()
    .refine((val) => {
      if (typeof val === 'undefined' || val === null) return true;
      return val >= 0;
    }, "Price must be greater than or equal to 0"),
  discount_percentage: z.number().min(0).max(100).optional().nullable()
    .refine((val) => {
      if (typeof val === 'undefined' || val === null) return true;
      return val >= 0 && val <= 100;
    }, "Discount percentage must be between 0 and 100"),
  discount_start_date: z.date().optional().nullable(),
  discount_end_date: z.date().optional().nullable()
    .superRefine((val, ctx) => {
      const startDate = ctx.parent.discount_start_date;
      if (!val || !startDate) return true;
      
      if (new Date(val) <= new Date(startDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
        });
        return false;
      }
      return true;
    }),
  is_featured_discount: z.boolean().optional().default(false),
  tags: z.array(z.string().uuid()).optional().default([]),
});

export type BookFormValues = z.infer<typeof bookSchema>;