import * as z from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const adSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  type: z.string({
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
    .refine((date: string) => new Date(date) >= new Date(), {
      message: "Start date must be in the future"
    }),
  end_date: z.string()
    .min(1, "End date is required")
    .superRefine((date, ctx: z.RefinementCtx & { parent: any }) => {
      type ParentInput = { start_date?: string };
      const parent = ctx.parent as ParentInput;
      const startDate = parent?.start_date;
      
      if (!startDate) return;
      
      if (new Date(date) <= new Date(startDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date"
        });
      }
    }),
  cta_text: z.string()
    .min(2, "CTA text must be at least 2 characters")
    .max(30, "CTA text must not exceed 30 characters")
    .optional(),
  target_audience: z.record(z.any()).optional(),
  ab_test_group: z.string().optional(),
  discount_strategy_id: z.string().uuid("Please select a valid discount strategy").optional(),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
});

export type AdFormValues = z.infer<typeof adSchema>;