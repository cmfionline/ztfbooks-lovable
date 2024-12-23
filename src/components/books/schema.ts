import * as z from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_EPUB_TYPES = [".epub"];

export const bookSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .refine(value => !/^\s*$/.test(value), "Title cannot be only whitespace"),

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
    .refine(
      file => !file || file instanceof File, 
      "Cover image must be a valid file"
    )
    .refine(
      file => !file || file.size <= MAX_FILE_SIZE,
      "Cover image must be less than 5MB"
    )
    .refine(
      file => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported for cover image"
    ),

  synopsis: z.string()
    .min(10, "Synopsis must be at least 10 characters")
    .max(2000, "Synopsis must be less than 2000 characters")
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
    .refine(
      file => !file || file instanceof File,
      "EPUB file must be a valid file"
    )
    .refine(
      file => !file || file.size <= 100000000,
      "EPUB file must be less than 100MB"
    )
    .refine(
      file => !file || file.name.endsWith('.epub'),
      "Only .epub format is supported"
    ),

  publicationDate: z.date()
    .optional()
    .nullable()
    .refine(
      val => !val || val <= new Date(),
      "Publication date cannot be in the future"
    ),

  pageCount: z.number()
    .int("Page count must be a whole number")
    .positive("Page count must be greater than 0")
    .optional()
    .nullable()
    .refine(
      val => !val || (val >= 1 && val <= 10000),
      "Page count must be between 1 and 10,000"
    ),

  isFree: z.boolean()
    .default(false),

  price: z.number()
    .min(0, "Price cannot be negative")
    .optional()
    .nullable()
    .refine(
      (val, ctx) => {
        if (ctx.parent.isFree) return true;
        return val !== null && val > 0;
      },
      "Price must be greater than 0 if the book is not free"
    ),

  hasDiscount: z.boolean()
    .default(false),

  discount_percentage: z.number()
    .min(0, "Discount percentage cannot be negative")
    .max(100, "Discount percentage cannot exceed 100")
    .optional()
    .nullable()
    .refine(
      (val, ctx) => {
        if (!ctx.parent.hasDiscount) return true;
        return val !== null && val > 0 && val <= 100;
      },
      "Discount percentage must be between 1 and 100 when discount is enabled"
    ),

  discount_start_date: z.date()
    .optional()
    .nullable()
    .refine(
      (val, ctx) => {
        if (!ctx.parent.hasDiscount) return true;
        return val !== null && val >= new Date();
      },
      "Discount start date must be in the future when discount is enabled"
    ),

  discount_end_date: z.date()
    .optional()
    .nullable()
    .refine(
      (val, ctx) => {
        if (!ctx.parent.hasDiscount) return true;
        if (!val || !ctx.parent.discount_start_date) return false;
        return val > ctx.parent.discount_start_date;
      },
      "Discount end date must be after start date"
    ),

  tags: z.array(z.string().uuid("Invalid tag ID format"))
    .optional()
    .default([])
    .refine(
      tags => tags.length <= 10,
      "Cannot assign more than 10 tags to a book"
    ),
});

export type BookFormValues = z.infer<typeof bookSchema>;