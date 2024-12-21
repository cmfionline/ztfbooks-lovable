import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { VoucherFormValues } from "../../schema";
import { BookSelectionField } from "../BookSelectionField";
import { SeriesSelectionField } from "../SeriesSelectionField";
import { TagSelectionField } from "../TagSelectionField";

interface VoucherTypeFieldsProps {
  form: UseFormReturn<VoucherFormValues>;
  books: any[];
  series: any[];
  tags: any[];
}

export const VoucherTypeFields = ({ form, books, series, tags }: VoucherTypeFieldsProps) => {
  return (
    <>
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
        <BookSelectionField form={form} books={books} />
      )}

      {form.watch("type") === "series" && (
        <SeriesSelectionField form={form} series={series} />
      )}

      {form.watch("type") === "book_tag" && (
        <TagSelectionField form={form} tags={tags} />
      )}
    </>
  );
};