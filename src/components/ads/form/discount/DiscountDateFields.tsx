import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { DiscountStrategyFormValues } from "../../discount-strategies/schema";

interface DiscountDateFieldsProps {
  control: Control<DiscountStrategyFormValues>;
}

export const DiscountDateFields = ({ control }: DiscountDateFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
              Start Date
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="date"
                className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
              End Date
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="date"
                className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};