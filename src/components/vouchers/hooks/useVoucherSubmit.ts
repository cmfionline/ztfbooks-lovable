import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VoucherFormValues } from "../schema";

export const useVoucherSubmit = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: VoucherFormValues, selectedBooks: string[]) => {
    setIsLoading(true);
    try {
      // Generate a random voucher code
      const voucherCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Create the voucher
      const { data: voucher, error: voucherError } = await supabase
        .from('vouchers')
        .insert({
          code: voucherCode,
          type: values.type,
          client_id: values.clientId,
          created_by: "00000000-0000-0000-0000-000000000000", // Temporary placeholder until user system is implemented
          number_of_downloads: Number(values.number_of_downloads),
        })
        .select()
        .single();

      if (voucherError) throw voucherError;

      // Link books or series based on type
      if (values.type === 'single_book' && values.bookId) {
        const { error: bookError } = await supabase
          .from('voucher_books')
          .insert({
            voucher_id: voucher.id,
            book_id: values.bookId,
          });
        if (bookError) throw bookError;
      } else if (values.type === 'multiple_books' && selectedBooks.length > 0) {
        const bookInserts = selectedBooks.map(bookId => ({
          voucher_id: voucher.id,
          book_id: bookId,
        }));
        const { error: booksError } = await supabase
          .from('voucher_books')
          .insert(bookInserts);
        if (booksError) throw booksError;
      } else if (values.type === 'series' && values.seriesId) {
        const { error: seriesError } = await supabase
          .from('voucher_series')
          .insert({
            voucher_id: voucher.id,
            series_id: values.seriesId,
          });
        if (seriesError) throw seriesError;
      } else if (values.type === 'book_tag' && values.tagId) {
        const { error: tagError } = await supabase
          .from('voucher_tags')
          .insert({
            voucher_id: voucher.id,
            tag_id: values.tagId,
          });
        if (tagError) throw tagError;
      }

      toast.success("Voucher created successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating voucher:", error);
      toast.error(error.message || "Failed to create voucher");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};