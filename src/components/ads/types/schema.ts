import * as z from "zod";

export const adTypeSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  type: z.string()
    .min(2, "Type must be at least 2 characters")
    .max(30, "Type must not exceed 30 characters")
    .regex(/^[a-z0-9_]+$/, "Type must contain only lowercase letters, numbers, and underscores"),
  description: z.string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type AdTypeFormValues = z.infer<typeof adTypeSchema>;