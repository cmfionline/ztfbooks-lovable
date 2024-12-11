import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ClientInfoFields } from "./ClientInfoFields";
import { VoucherTypeSelect } from "./VoucherTypeSelect";
import { BookMultiSelect } from "./BookMultiSelect";
import { SeriesSelectionField } from "@/components/vouchers/components/SeriesSelectionField";
import { TagSelectionField } from "./TagSelectionField";
import { BookSelectionField } from "./BookSelectionField";
import { VoucherFormFields } from "./VoucherFormFields";

interface VoucherFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  books: any[];
  series: any[];
  tags: any[];
  selectedBooks: string[];
  setSelectedBooks: (books: string[]) => void;
}

export const VoucherForm = ({
  form,
  onSubmit,
  isLoading,
  books,
  series,
  tags,
  selectedBooks,
  setSelectedBooks,
}: VoucherFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ClientInfoFields form={form} />
        <VoucherTypeSelect form={form} />
        
        {form.watch("type") === "single_book" && (
          <BookSelectionField form={form} books={books} />
        )}

        {form.watch("type") === "multiple_books" && (
          <BookMultiSelect
            form={form}
            books={books}
            selectedBooks={selectedBooks}
            setSelectedBooks={setSelectedBooks}
          />
        )}

        {form.watch("type") === "series" && (
          <SeriesSelectionField form={form} series={series} />
        )}

        {form.watch("type") === "book_tag" && (
          <TagSelectionField form={form} tags={tags} />
        )}

        <VoucherFormFields form={form} />

        <Button 
          type="submit" 
          className="w-full bg-purple hover:bg-purple/90 text-white" 
          disabled={isLoading}
        >
          Create Voucher
        </Button>
      </form>
    </Form>
  );
};