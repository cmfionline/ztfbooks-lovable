import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";

interface PricingFieldsProps {
  control: Control<any>;
}

export const PricingFields = ({ control }: PricingFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="is_free"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-primary">Free Book</FormLabel>
              <p className="text-sm text-gray-500">Make this book available for free</p>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                disabled={field.value === true}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="border-purple-light focus:border-purple focus:ring-purple"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};