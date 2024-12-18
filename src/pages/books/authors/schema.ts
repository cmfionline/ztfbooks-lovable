import * as z from "zod";

export const authorFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s\-'.]+$/,
      "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
    )
    .transform((val) => val.trim()),
  nationality: z.string().optional(),
  photo: z.union([z.instanceof(File), z.string()]).optional(),
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

export type AuthorFormValues = z.infer<typeof authorFormSchema>;