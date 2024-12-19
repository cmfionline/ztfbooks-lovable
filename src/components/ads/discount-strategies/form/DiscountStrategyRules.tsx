import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { DiscountStrategyFormValues } from "../schema";

interface DiscountStrategyRulesProps {
  control: Control<DiscountStrategyFormValues>;
  discountType: string;
}

export const DiscountStrategyRules = ({ control, discountType }: DiscountStrategyRulesProps) => {
  const isPercentageDiscount = discountType === "percentage";
  const isFixedDiscount = discountType === "fixed";
  const isVolumeDiscount = discountType === "volume";

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="value"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
              {isFixedDiscount ? 'Fixed Amount' : 'Discount Percentage'}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0"
                step={isFixedDiscount ? "0.01" : "1"}
                max={isFixedDiscount ? undefined : "100"}
                placeholder={isFixedDiscount ? "Enter amount" : "Enter percentage"}
                className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all"
                {...field}
                value={value || ""}
                onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : 0)}
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-500">
              {isFixedDiscount 
                ? "Enter the fixed amount to discount (e.g., 10 for $10 off)" 
                : "Enter the percentage to discount (e.g., 20 for 20% off)"}
            </FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {(isPercentageDiscount || isFixedDiscount) && (
        <FormField
          control={control}
          name="min_purchase_amount"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Minimum Purchase Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter minimum amount"
                  className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all"
                  {...field}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Minimum cart value required to apply this discount
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      )}

      {isVolumeDiscount && (
        <FormField
          control={control}
          name="min_books_count"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Minimum Books Count</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter minimum books count"
                  className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all"
                  {...field}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Minimum number of books required to apply this volume discount
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="is_stackable"
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