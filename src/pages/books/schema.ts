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

export const authorSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s\-'.]+$/,
      "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
    ),
  nationality: z.string().optional(),
  photo: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  facebook_url: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  twitter_url: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  instagram_url: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
  date_of_birth: z.string().optional(),
  designation: z.string().optional(),
  education: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

export type AuthorFormValues = z.infer<typeof authorSchema>;

export const seriesSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  language_id: z.string().uuid().optional(),
  image: z.any().optional(),
});

export type SeriesFormValues = z.infer<typeof seriesSchema>;

export const publisherSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  address: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  photo: z.string().optional(),
  social_media_url: z.string().url("Invalid social media URL").optional(),
  website: z.string().url("Invalid website URL").optional(),
});

export type PublisherFormValues = z.infer<typeof publisherSchema>;

export const tagSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
});

export type TagFormValues = z.infer<typeof tagSchema>;

export const languageSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  code: z.string()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code must be less than 10 characters"),
});

export type LanguageFormValues = z.infer<typeof languageSchema>;