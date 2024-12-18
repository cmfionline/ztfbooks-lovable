import * as z from "zod";

export const bookSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  seriesId: z.string().uuid().optional(),
  languageId: z.string().uuid("Language is required"),
  coverImage: z.any().optional(),
  synopsis: z.string().optional(),
  authorId: z.string().uuid("Author is required"),
  publisherId: z.string().uuid().optional(),
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
  discount_end_date: z.date().optional().nullable(),
  is_featured_discount: z.boolean().optional().default(false),
  tags: z.array(z.string().uuid()).optional().default([]),
}).refine((data) => {
  if (!data.discount_end_date || !data.discount_start_date) return true;
  return new Date(data.discount_end_date) > new Date(data.discount_start_date);
}, {
  message: "End date must be after start date",
  path: ["discount_end_date"]
});

export type BookFormValues = z.infer<typeof bookSchema>;