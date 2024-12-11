import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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
        name="clientEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="client@example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <Input {...field} type="number" min="0" step="0.01" />
            </FormControl>
            <FormMessage />
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
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};