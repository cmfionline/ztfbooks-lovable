import { z } from "zod";

export const voucherFormSchema = z.object({
  type: z.enum(["single_book", "multiple_books", "series", "book_tag", "all_books"]),
  bookId: z.string().optional(),
  seriesId: z.string().optional(),
  tagId: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email address"),
  number_of_downloads: z.string().min(1, "Number of downloads is required"),
});

export type VoucherFormValues = z.infer<typeof voucherFormSchema>;