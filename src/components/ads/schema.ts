import * as z from "zod";

export const adSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["banner", "interstitial", "popup", "sponsored"]),
  placement: z.enum(["home", "category", "checkout", "series", "book"]),
  content: z.string().min(1, "Content is required"),
  html_content: z.string().optional(),
  image_url: z.string().url().optional(),
  video_url: z.string().url().optional(),
  preview_mobile_url: z.string().url().optional(),
  preview_tablet_url: z.string().url().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  cta_text: z.string().optional(),
  target_audience: z.record(z.any()).optional(),
  ab_test_group: z.string().optional(),
});

export type AdFormValues = z.infer<typeof adSchema>;