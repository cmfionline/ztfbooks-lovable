import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface VoucherTypeSelectProps {
  form: UseFormReturn<any>;
}

export const VoucherTypeSelect = ({ form }: VoucherTypeSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Voucher Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select voucher type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single_book">Single Book</SelectItem>
              <SelectItem value="multiple_books">Multiple Books</SelectItem>
              <SelectItem value="series">Book Series</SelectItem>
              <SelectItem value="book_tag">Book Tag</SelectItem>
              <SelectItem value="all_books">All Books</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};