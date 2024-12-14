import * as z from "zod";

export const bookSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  series_id: z.string().uuid().optional(),
  language_id: z.string().uuid("Language is required"),
  cover_image: z.any().optional(),
  synopsis: z.string().optional(),
  author_id: z.string().uuid("Author is required"),
  publisher_id: z.string().uuid().optional(),
  epub_file: z.any().optional(),
  publication_date: z.date().optional(),
  page_count: z.number().int().positive().optional(),
  is_free: z.boolean().default(false),
  price: z.number().min(0).optional(),
  tags: z.array(z.string().uuid()).optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;