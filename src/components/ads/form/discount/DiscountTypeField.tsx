import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { DiscountStrategyFormValues } from "../../discount-strategies/schema";

interface DiscountTypeFieldProps {
  control: Control<DiscountStrategyFormValues>;
}

export const DiscountTypeField = ({ control }: DiscountTypeFieldProps) => {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
            Discount Type
            <span className="text-red-500">*</span>
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              <SelectItem value="percentage" className="hover:bg-purple-light/50">Percentage</SelectItem>
              <SelectItem value="fixed" className="hover:bg-purple-light/50">Fixed Amount</SelectItem>
              <SelectItem value="volume" className="hover:bg-purple-light/50">Volume Discount</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription className="text-xs text-gray-500">
            Choose how the discount will be applied
          </FormDescription>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};