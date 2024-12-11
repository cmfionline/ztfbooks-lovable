import * as z from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const adSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["banner", "interstitial", "popup", "sponsored"]),
  placement: z.enum(["home", "category", "checkout", "series", "book"]),
  content: z.string().min(1, "Content is required"),
  html_content: z.string().optional(),
  image_file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),
  video_file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(file => ACCEPTED_VIDEO_TYPES.includes(file.type), "Only .mp4 and .webm formats are supported.")
    .optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  cta_text: z.string().optional(),
  target_audience: z.record(z.any()).optional(),
  ab_test_group: z.string().optional(),
});

export type AdFormValues = z.infer<typeof adSchema>;