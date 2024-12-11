import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface VoucherTypeFieldProps {
  form: UseFormReturn<any>;
}

export const VoucherTypeField = ({ form }: VoucherTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Voucher Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white border-purple-light focus:border-purple">
                <SelectValue placeholder="Select voucher type" className="text-foreground" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              <SelectItem value="single_book" className="hover:bg-purple-light/10">Single Book</SelectItem>
              <SelectItem value="series" className="hover:bg-purple-light/10">Book Series</SelectItem>
              <SelectItem value="all_books" className="hover:bg-purple-light/10">All Books</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};