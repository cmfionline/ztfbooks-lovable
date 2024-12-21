import { z } from "zod";

export const voucherFormSchema = z.object({
  type: z.enum(["single_book", "multiple_books", "series", "book_tag", "all_books"]),
  bookId: z.string().optional(),
  seriesId: z.string().optional(),
  tagId: z.string().optional(),
  clientId: z.string(),
  number_of_downloads: z.string().min(1, "Number of downloads is required"),
}).refine((data) => {
  if (data.type === 'single_book' && !data.bookId) {
    return false;
  }
  if (data.type === 'series' && !data.seriesId) {
    return false;
  }
  if (data.type === 'book_tag' && !data.tagId) {
    return false;
  }
  return true;
}, {
  message: "Please select the required item based on voucher type",
  path: ["bookId"]
});

export type VoucherFormValues = z.infer<typeof voucherFormSchema>;