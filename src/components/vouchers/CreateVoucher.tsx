import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { VoucherTypeField } from "./components/VoucherTypeField";
import { BookSelectionField } from "./components/BookSelectionField";
import { SeriesSelectionField } from "./components/SeriesSelectionField";
import { VoucherFormFields } from "./components/VoucherFormFields";

const CreateVoucher = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, price, is_free')
        .eq('is_free', false)  // Only fetch paid books
        .order('title');
      if (error) throw error;
      return data;
    }
  });

  const { data: series } = useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('series')
        .select('id, name');
      if (error) throw error;
      return data;
    }
  });

  const form = useForm({
    defaultValues: {
      type: "single_book",
      bookId: "",
      seriesId: "",
      clientEmail: "",
      numberOfDownloads: "1",
    }
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Calculate total amount based on book price or set to 0 for series
      let totalAmount = 0;
      if (values.type === 'single_book' && values.bookId) {
        const selectedBook = books?.find(book => book.id === values.bookId);
        totalAmount = selectedBook?.price || 0;
      }
      // For series type, totalAmount remains 0

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
          total_amount: totalAmount,
          number_of_downloads: Number(values.numberOfDownloads),
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
      } else if (values.type === 'series' && values.seriesId) {
        const { error: seriesError } = await supabase
          .from('voucher_series')
          .insert({
            voucher_id: voucher.id,
            series_id: values.seriesId,
          });
        if (seriesError) throw seriesError;
      }

      toast.success("Voucher created successfully");
      navigate('/vouchers');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create Voucher</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <VoucherTypeField form={form} />
          <BookSelectionField form={form} books={books || []} />
          <SeriesSelectionField form={form} series={series || []} />
          <VoucherFormFields form={form} />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vouchers')}
              className="border-purple text-purple hover:bg-purple/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-purple hover:bg-purple/90 text-white"
            >
              Create Voucher
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateVoucher;