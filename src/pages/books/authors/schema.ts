import * as z from "zod";

export const authorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nationality: z.string().optional(),
  photo: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  facebook_url: z.string().url().optional().or(z.literal("")),
  twitter_url: z.string().url().optional().or(z.literal("")),
  instagram_url: z.string().url().optional().or(z.literal("")),
  date_of_birth: z.string().optional(),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;