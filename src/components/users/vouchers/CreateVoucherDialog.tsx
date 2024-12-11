import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VoucherForm } from "./components/VoucherForm";

interface CreateVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

const CreateVoucherDialog = ({ open, onOpenChange, clientId }: CreateVoucherDialogProps) => {
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
      numberOfDownloads: "1",
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
          number_of_downloads: Number(values.numberOfDownloads),
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
      onOpenChange(false);
      form.reset();
      setSelectedBooks([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Voucher</DialogTitle>
        </DialogHeader>
        <VoucherForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
          books={books || []}
          series={series || []}
          tags={tags || []}
          selectedBooks={selectedBooks}
          setSelectedBooks={setSelectedBooks}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateVoucherDialog;