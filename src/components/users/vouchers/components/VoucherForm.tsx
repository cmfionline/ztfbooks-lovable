import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ClientInfoFields } from "./ClientInfoFields";
import { VoucherTypeSelect } from "./VoucherTypeSelect";
import { BookMultiSelect } from "./BookMultiSelect";
import { SeriesSelectionField } from "@/components/vouchers/components/SeriesSelectionField";
import { VoucherAmountField } from "./VoucherAmountField";
import { TagSelectionField } from "./TagSelectionField";
import { BookSelectionField } from "./BookSelectionField";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VoucherFormProps {
  clientId: string;
  onSuccess: () => void;
}

export const VoucherForm = ({ clientId, onSuccess }: VoucherFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, title');
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

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
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
      tagId: "",
      clientName: "",
      clientEmail: "",
      amount: "",
    }
  });

  const onSubmit = async (values: any) => {
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
          client_id: clientId,
          created_by: userData.user.id,
          total_amount: Number(values.amount),
        })
        .select()
        .single();

      if (voucherError) throw voucherError;

      // Link books based on type
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
      form.reset();
      setSelectedBooks([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <ClientInfoFields form={form} />
      <VoucherTypeSelect form={form} />
      
      {form.watch("type") === "single_book" && (
        <BookSelectionField form={form} books={books || []} />
      )}

      {form.watch("type") === "multiple_books" && (
        <BookMultiSelect
          form={form}
          books={books || []}
          selectedBooks={selectedBooks}
          setSelectedBooks={setSelectedBooks}
        />
      )}

      {form.watch("type") === "series" && (
        <SeriesSelectionField form={form} series={series || []} />
      )}

      {form.watch("type") === "book_tag" && (
        <TagSelectionField form={form} tags={tags || []} />
      )}

      <VoucherAmountField form={form} />

      <Button 
        type="submit" 
        className="w-full bg-purple hover:bg-purple/90 text-white" 
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Voucher"}
      </Button>
    </form>
  );
};