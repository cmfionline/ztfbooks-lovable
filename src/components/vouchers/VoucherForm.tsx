import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ClientInfoFields } from "./ClientInfoFields";
import { VoucherTypeSelect } from "./VoucherTypeSelect";
import { BookMultiSelect } from "./BookMultiSelect";
import { SeriesSelectionField } from "./SeriesSelectionField";
import { VoucherAmountField } from "./VoucherAmountField";
import { TagSelectionField } from "./TagSelectionField";
import { BookSelectionField } from "./BookSelectionField";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { voucherFormSchema, type VoucherFormValues } from "./schema";
import { useVoucherSubmit } from "./hooks/useVoucherSubmit";
import { Loader2 } from "lucide-react";

interface VoucherFormProps {
  clientId: string;
  onSuccess: () => void;
}

export const VoucherForm = ({ clientId, onSuccess }: VoucherFormProps) => {
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const { handleSubmit, isLoading } = useVoucherSubmit(onSuccess);

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      type: "single_book",
      bookId: "",
      seriesId: "",
      tagId: "",
      clientId,
      clientName: "",
      clientEmail: "",
      amount: "",
    }
  });

  const { data: books, isLoading: isBooksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, title');
      if (error) throw error;
      return data;
    }
  });

  const { data: series, isLoading: isSeriesLoading } = useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('series')
        .select('id, name');
      if (error) throw error;
      return data;
    }
  });

  const { data: tags, isLoading: isTagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name');
      if (error) throw error;
      return data;
    }
  });

  const onSubmit = (values: VoucherFormValues) => {
    handleSubmit(values, selectedBooks);
  };

  const isFormLoading = isBooksLoading || isSeriesLoading || isTagsLoading;

  if (isFormLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-purple" />
      </div>
    );
  }

  return (
    <Form {...form}>
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
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Voucher"
          )}
        </Button>
      </form>
    </Form>
  );
};
