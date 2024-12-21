import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { voucherFormSchema, type VoucherFormValues } from "../schema";
import { BookSelectionField } from "./BookSelectionField";
import { SeriesSelectionField } from "./SeriesSelectionField";
import { TagSelectionField } from "./TagSelectionField";
import { useVoucherSubmit } from "../hooks/useVoucherSubmit";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      clientId: "",
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

        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input {...field} className="border-purple-light focus:border-purple" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" className="border-purple-light focus:border-purple" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voucher Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-purple-light focus:border-purple">
                    <SelectValue placeholder="Select voucher type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single_book">Single Book</SelectItem>
                  <SelectItem value="multiple_books">Multiple Books</SelectItem>
                  <SelectItem value="series">Book Series</SelectItem>
                  <SelectItem value="book_tag">Book Tag</SelectItem>
                  <SelectItem value="all_books">All Books</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("type") === "single_book" && (
          <BookSelectionField form={form} books={books || []} />
        )}

        {form.watch("type") === "series" && (
          <SeriesSelectionField form={form} series={series || []} />
        )}

        {form.watch("type") === "book_tag" && (
          <TagSelectionField form={form} tags={tags || []} />
        )}

        <FormField
          control={form.control}
          name="number_of_downloads"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Downloads</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  min="1"
                  className="border-purple-light focus:border-purple" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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