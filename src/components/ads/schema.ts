import * as z from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const adSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  type: z.enum(["banner", "interstitial", "popup", "sponsored"], {
    required_error: "Please select an ad type",
  }),
  placement: z.enum(["home", "category", "checkout", "series", "book"], {
    required_error: "Please select a placement",
  }),
  content: z.string()
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content must not exceed 1000 characters"),
  html_content: z.string().optional(),
  image_file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),
  video_file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(file => ACCEPTED_VIDEO_TYPES.includes(file.type), "Only .mp4 and .webm formats are supported.")
    .optional(),
  start_date: z.string()
    .min(1, "Start date is required")
    .refine(date => new Date(date) >= new Date(), "Start date must be in the future"),
  end_date: z.string()
    .min(1, "End date is required")
    .refine(
      (date, ctx) => {
        const startDate = new Date(ctx.parent.start_date);
        const endDate = new Date(date);
        return endDate > startDate;
      },
      "End date must be after start date"
    ),
  cta_text: z.string()
    .min(2, "CTA text must be at least 2 characters")
    .max(30, "CTA text must not exceed 30 characters")
    .optional(),
  target_audience: z.record(z.any()).optional(),
  ab_test_group: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed", "volume", "cart"]).optional(),
  discount_value: z.number().min(0).optional(),
  min_purchase_amount: z.number().min(0).optional(),
  min_books_count: z.number().int().min(0).optional(),
  is_stackable: z.boolean().default(false),
  discount_start_date: z.string()
    .min(1, "Discount start date is required when applying a discount")
    .refine(
      date => new Date(date) >= new Date(),
      "Discount start date must be in the future"
    )
    .optional(),
  discount_end_date: z.string()
    .min(1, "Discount end date is required when applying a discount")
    .refine(
      (date, ctx) => {
        if (!ctx.parent.discount_start_date) return true;
        const startDate = new Date(ctx.parent.discount_start_date);
        const endDate = new Date(date);
        return endDate > startDate;
      },
      "Discount end date must be after discount start date"
    )
    .optional(),
});

export type AdFormValues = z.infer<typeof adSchema>;