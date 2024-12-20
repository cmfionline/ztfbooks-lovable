import { z } from "zod";

export const contentBlockSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  button_text: z.string().min(1, "Button text is required").optional(),
  button_link: z.string().url("Please enter a valid URL").optional(),
  order_index: z.number().int().min(0, "Order index must be 0 or greater"),
  is_active: z.boolean().default(true),
});

export type ContentBlock = z.infer<typeof contentBlockSchema> & {
  id: string;
  created_at?: string;
  updated_at?: string;
};

export type ContentBlockFormValues = z.infer<typeof contentBlockSchema>;

export interface ContentBlockFormProps {
  initialData?: ContentBlock;
  onSuccess?: () => void;
}

export type ContentBlockMutationContext = {
  previousBlocks: ContentBlock[];
};