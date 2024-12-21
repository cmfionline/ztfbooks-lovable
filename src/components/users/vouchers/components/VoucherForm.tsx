import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { voucherFormSchema, type VoucherFormValues } from "../schema";
import { useVoucherSubmit } from "../hooks/useVoucherSubmit";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { ClientInfoFields } from "./form/ClientInfoFields";
import { VoucherTypeFields } from "./form/VoucherTypeFields";
import { DownloadsField } from "./form/DownloadsField";

export const VoucherForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const { handleSubmit, isLoading } = useVoucherSubmit(onSuccess);

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

  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      type: "single_book",
      bookId: "",
      seriesId: "",
      tagId: "",
      clientId: uuidv4(),
      clientName: "",
      clientEmail: "",
      number_of_downloads: "1",
    },
    mode: "onChange"
  });

  const onSubmit = async (values: VoucherFormValues) => {
    try {
      await handleSubmit(values);
      toast({
        title: "Success",
        description: "Voucher created successfully",
        className: "bg-green-50 border-green-200",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create voucher",
        variant: "destructive",
      });
    }
  };

  const hasFormErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {hasFormErrors && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Please fix the highlighted errors before submitting the form.
            </AlertDescription>
          </Alert>
        )}

        <ClientInfoFields form={form} />
        <VoucherTypeFields 
          form={form} 
          books={books || []} 
          series={series || []} 
          tags={tags || []} 
        />
        <DownloadsField form={form} />

        <Button 
          type="submit" 
          className="w-full bg-purple hover:bg-purple/90"
          disabled={isLoading || hasFormErrors}
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