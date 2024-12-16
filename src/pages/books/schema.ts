import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_EPUB_TYPES = ["application/epub+zip"];

export const bookSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  series_id: z.string().uuid().optional(),
  language_id: z.string().uuid("Language is required"),
  cover_image: z.any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
  synopsis: z.string().optional(),
  author_id: z.string().uuid("Author is required"),
  publisher_id: z.string().uuid().optional(),
  epub_file: z.any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => !file || ACCEPTED_EPUB_TYPES.includes(file?.type),
      "Only .epub format is supported"
    )
    .optional(),
  publication_date: z.date().optional(),
  page_count: z.number().int().positive().optional(),
  is_free: z.boolean().default(false),
  price: z.number().min(0)
    .optional()
    .refine((val) => val !== undefined || is_free, {
      message: "Price is required when book is not free"
    }),
  tags: z.array(z.string().uuid()).optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;