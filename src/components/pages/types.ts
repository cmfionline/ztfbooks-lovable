import { z } from "zod";

export const pageFormSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string()
    .min(1, "Content is required")
    .max(50000, "Content must be less than 50,000 characters"),
  status: z.enum(["active", "draft", "archived"])
    .default("active"),
  order_index: z.number()
    .int("Order must be a whole number")
    .min(0, "Order must be 0 or greater")
    .default(0),
});

export type PageFormValues = z.infer<typeof pageFormSchema>;

export interface Page extends PageFormValues {
  id: string;
  created_at: string;
  updated_at: string;
}