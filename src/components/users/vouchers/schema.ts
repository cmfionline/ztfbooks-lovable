import { z } from "zod";

export const voucherFormSchema = z.object({
  type: z.enum(["single_book", "multiple_books", "series", "book_tag", "all_books"]),
  bookId: z.string().optional(),
  seriesId: z.string().optional(),
  tagId: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email address"),
  amount: z.string().min(1, "Amount is required"),
});

export type VoucherFormValues = z.infer<typeof voucherFormSchema>;