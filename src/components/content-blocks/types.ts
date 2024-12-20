import { z } from "zod";

export const contentBlockSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  button_text: z.string().optional(),
  button_link: z.string().optional(),
  order_index: z.number().int().min(0),
  is_active: z.boolean().default(true),
});

export type ContentBlockFormValues = z.infer<typeof contentBlockSchema>;

export interface ContentBlockFormProps {
  initialData?: ContentBlockFormValues & { id: string };
  onSuccess?: () => void;
}