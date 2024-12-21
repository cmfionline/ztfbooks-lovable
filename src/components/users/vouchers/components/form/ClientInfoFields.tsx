import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { VoucherFormValues } from "../../schema";

interface ClientInfoFieldsProps {
  form: UseFormReturn<VoucherFormValues>;
}

export const ClientInfoFields = ({ form }: ClientInfoFieldsProps) => {
  return (
    <>
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
    </>
  );
};