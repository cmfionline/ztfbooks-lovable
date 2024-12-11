import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VoucherFormValues } from "../schema";

export const useVoucherSubmit = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: VoucherFormValues, selectedBooks: string[]) => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const voucherCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { data: voucher, error: voucherError } = await supabase
        .from('vouchers')
        .insert({
          code: voucherCode,
          type: values.type,
          client_id: values.clientId,
          created_by: userData.user.id,
          total_amount: Number(values.amount),
        })
        .select()
        .single();

      if (voucherError) throw voucherError;

      if (values.type === 'single_book' && values.bookId) {
        await supabase
          .from('voucher_books')
          .insert({
            voucher_id: voucher.id,
            book_id: values.bookId,
          });
      } else if (values.type === 'multiple_books' && selectedBooks.length > 0) {
        const bookInserts = selectedBooks.map(bookId => ({
          voucher_id: voucher.id,
          book_id: bookId,
        }));
        await supabase.from('voucher_books').insert(bookInserts);
      } else if (values.type === 'series' && values.seriesId) {
        await supabase
          .from('voucher_series')
          .insert({
            voucher_id: voucher.id,
            series_id: values.seriesId,
          });
      } else if (values.type === 'book_tag' && values.tagId) {
        await supabase
          .from('voucher_tags')
          .insert({
            voucher_id: voucher.id,
            tag_id: values.tagId,
          });
      }

      toast.success("Voucher created successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};