import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { VoucherTypeSelect } from "./VoucherTypeSelect";
import { BookSelectionField } from "./BookSelectionField";
import { SeriesSelectionField } from "./SeriesSelectionField";
import { TagSelectionField } from "./TagSelectionField";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useVoucherSubmit } from "../hooks/useVoucherSubmit";
import { voucherFormSchema, type VoucherFormValues } from "../schema";
import { Loader2 } from "lucide-react";

interface VoucherFormProps {
  clientId: string;
  onSuccess: () => void;
}

export const VoucherForm = ({ clientId, onSuccess }: VoucherFormProps) => {
  const { handleSubmit, isLoading } = useVoucherSubmit(onSuccess);

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      type: "single_book",
      bookId: "",
      seriesId: "",
      tagId: "",
      clientId,
      number_of_downloads: "1",
    }
  });

  const { data: books, isLoading: isBooksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, title')
        .order('title');
      if (error) throw error;
      return data;
    }
  });

  const { data: series, isLoading: isSeriesLoading } = useQuery({
    queryKey: ['series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('series')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: tags, isLoading: isTagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const onSubmit = (values: VoucherFormValues) => {
    handleSubmit(values);
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
        <VoucherTypeSelect form={form} />
        <BookSelectionField form={form} books={books || []} />
        <SeriesSelectionField form={form} series={series || []} />
        <TagSelectionField form={form} tags={tags || []} />

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