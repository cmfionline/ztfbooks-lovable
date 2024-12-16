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
  price: z.number().min(0).optional()
    .refine((val) => {
      if (typeof val === 'undefined') return true;
      return val > 0;
    }, "Price must be greater than 0"),
  tags: z.array(z.string().uuid()).optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;