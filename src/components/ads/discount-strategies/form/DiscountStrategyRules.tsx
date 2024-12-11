import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { DiscountStrategyFormValues } from "../schema";

interface DiscountStrategyRulesProps {
  control: Control<DiscountStrategyFormValues>;
}

export const DiscountStrategyRules = ({ control }: DiscountStrategyRulesProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="value"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Discount Value</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="Enter discount value"
                {...field}
                value={value || ""}
                onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="minPurchaseAmount"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Minimum Purchase Amount</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="Enter minimum purchase amount"
                {...field}
                value={value || ""}
                onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="minBooksCount"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Minimum Books Count</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="Enter minimum books count"
                {...field}
                value={value || ""}
                onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="isStackable"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Stackable Discount</FormLabel>
              <FormDescription>
                Allow this discount to be combined with other discounts
              </FormDescription>
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
    </div>
  );
};