import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface VoucherAmountFieldProps {
  form: UseFormReturn<any>;
}

export const VoucherAmountField = ({ form }: VoucherAmountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <Input {...field} type="number" min="0" step="0.01" />
          </FormControl>
        </FormItem>
      )}
    />
  );
};