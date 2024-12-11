import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { DiscountStrategyFormValues } from "../../discount-strategies/schema";

interface StackableDiscountFieldProps {
  control: Control<DiscountStrategyFormValues>;
}

export const StackableDiscountField = ({ control }: StackableDiscountFieldProps) => {
  return (
    <FormField
      control={control}
      name="is_stackable"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel className="text-gray-700">Stackable Discount</FormLabel>
            <FormDescription className="text-xs text-gray-500">
              Allow combining with other active discounts
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-purple"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};