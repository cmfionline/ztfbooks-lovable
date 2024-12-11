import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface VoucherFormFieldsProps {
  form: UseFormReturn<any>;
}

export const VoucherFormFields = ({ form }: VoucherFormFieldsProps) => {
  return (
    <>
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

      <FormField
        control={form.control}
        name="numberOfDownloads"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Downloads</FormLabel>
            <FormControl>
              <Input {...field} type="number" min="1" step="1" />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};