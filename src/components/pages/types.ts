import { z } from "zod";

export const pageFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  order_index: z.number().default(0),
});

export type PageFormValues = z.infer<typeof pageFormSchema>;

export interface Page extends PageFormValues {
  id: string;
  created_at: string;
  updated_at: string;
}