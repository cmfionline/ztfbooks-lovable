import * as z from "zod";

export const bookSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .transform(val => val.trim()),
  seriesId: z.string()
    .uuid("Invalid series ID format")
    .optional()
    .nullable()
    .transform(val => val === "null" ? null : val),
  languageId: z.string()
    .uuid("Please select a valid language")
    .transform(val => val.trim()),
  coverImage: z.any()
    .optional()
    .refine(val => !val || (val instanceof File && val.size < 5000000), {
      message: "Cover image must be less than 5MB"
    }),
  synopsis: z.string()
    .optional()
    .transform(val => val?.trim() || undefined),
  authorId: z.string()
    .uuid("Please select a valid author")
    .transform(val => val.trim()),
  publisherId: z.string()
    .uuid("Please select a valid publisher")
    .optional()
    .nullable()
    .transform(val => val === "null" ? null : val),
  epubFile: z.any()
    .optional()
    .refine(val => !val || (val instanceof File && val.size < 100000000), {
      message: "EPUB file must be less than 100MB"
    }),
  publicationDate: z.date()
    .optional()
    .nullable()
    .refine(val => !val || val <= new Date(), {
      message: "Publication date cannot be in the future"
    }),
  pageCount: z.number()
    .int("Page count must be a whole number")
    .positive("Page count must be greater than 0")
    .optional()
    .nullable(),
  isFree: z.boolean()
    .default(false),
  price: z.number()
    .min(0, "Price cannot be negative")
    .optional()
    .nullable()
    .refine(val => !val || val > 0, {
      message: "Price must be greater than 0 if the book is not free"
    }),
  tags: z.array(z.string().uuid("Invalid tag ID format"))
    .optional()
    .default([]),
});

export type BookFormValues = z.infer<typeof bookSchema>;