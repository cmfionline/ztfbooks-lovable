import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { VoucherFormValues } from "../../schema";

interface DownloadsFieldProps {
  form: UseFormReturn<VoucherFormValues>;
}

export const DownloadsField = ({ form }: DownloadsFieldProps) => {
  return (
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
  );
};