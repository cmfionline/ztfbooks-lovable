import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { AdFormValues } from "../../schema";

interface StackableDiscountFieldProps {
  control: Control<AdFormValues>;
}

export const StackableDiscountField = ({ control }: StackableDiscountFieldProps) => {
  return (
    <FormField
      control={control}
      name="is_stackable"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Stackable Discount</FormLabel>
            <FormDescription className="text-xs">
              Allow combining with other active discounts
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-primary"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};