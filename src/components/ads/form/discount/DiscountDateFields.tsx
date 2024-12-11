import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { AdFormValues } from "../../schema";
import { cn } from "@/lib/utils";

interface DiscountDateFieldsProps {
  control: Control<AdFormValues>;
}

export const DiscountDateFields = ({ control }: DiscountDateFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="discount_start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Discount Start
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="datetime-local"
                className={cn(
                  "focus:ring-2 focus:ring-primary/20 transition-all",
                  "text-sm text-gray-600"
                )}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="discount_end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Discount End
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="datetime-local"
                className={cn(
                  "focus:ring-2 focus:ring-primary/20 transition-all",
                  "text-sm text-gray-600"
                )}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};