import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VoucherFormValues } from "../schema";

export const useVoucherSubmit = (onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: VoucherFormValues) => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // First, ensure the client exists in profiles or create them
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', values.clientId)
        .single();

      if (!existingProfile) {
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: values.clientId,
            full_name: values.clientName,
          })
          .select()
          .single();

        if (profileError) throw profileError;
      }

      // Generate a random voucher code
      const voucherCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Create the voucher
      const { data: voucher, error: voucherError } = await supabase
        .from('vouchers')
        .insert({
          code: voucherCode,
          type: values.type,
          client_id: values.clientId,
          created_by: userData.user.id,
          number_of_downloads: Number(values.number_of_downloads),
          total_amount: 0, // Set based on your pricing logic
          status: 'active'
        })
        .select()
        .single();

      if (voucherError) throw voucherError;

      // Link books, series, or tags based on type
      if (values.type === 'single_book' && values.bookId) {
        const { error: bookError } = await supabase
          .from('voucher_books')
          .insert({
            voucher_id: voucher.id,
            book_id: values.bookId,
          });
        if (bookError) throw bookError;
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