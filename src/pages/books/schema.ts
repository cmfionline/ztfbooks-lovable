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
  publicationDate: z.date().optional(),
  pageCount: z.number().int().positive().optional(),
  isFree: z.boolean().default(false),
  hasDiscount: z.boolean().default(false),
  price: z.number().min(0).optional(),
  discount_percentage: z.number().min(0).max(100).optional()
    .superRefine((val, ctx) => {
      if (ctx.parent.hasDiscount && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount percentage is required when discount is enabled"
        });
      }
    }),
  discount_start_date: z.date().optional()
    .superRefine((val, ctx) => {
      if (ctx.parent.hasDiscount && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start date is required when discount is enabled"
        });
      }
    }),
  discount_end_date: z.date().optional()
    .superRefine((val, ctx) => {
      if (ctx.parent.hasDiscount && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date is required when discount is enabled"
        });
      }
      if (val && ctx.parent.discount_start_date && val <= ctx.parent.discount_start_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date"
        });
      }
    }),
  tags: z.array(z.string().uuid()).optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;