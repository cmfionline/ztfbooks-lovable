import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { AdFormValues } from "../../schema";

interface DiscountValueFieldsProps {
  control: Control<AdFormValues>;
  discountType: string | undefined;
}

export const DiscountValueFields = ({ control, discountType }: DiscountValueFieldsProps) => {
  const showMinPurchase = discountType === "cart";
  const showMinBooks = discountType === "volume";
  const isPercentageDiscount = discountType === "percentage" || discountType === "volume" || discountType === "cart";

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="discount_value"
        render={({ field: { value, onChange, ...field }, formState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
              Discount Value
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                step={isPercentageDiscount ? "0.01" : "1"}
                placeholder={isPercentageDiscount ? "e.g., 15 for 15%" : "Amount"}
                className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all"
                {...field}
                value={value || ""}
                onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {showMinPurchase && (
        <FormField
          control={control}
          name="min_purchase_amount"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Min. Purchase</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="e.g., 50"
                  className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all"
                  {...field}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      )}

      {showMinBooks && (
        <FormField
          control={control}
          name="min_books_count"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Min. Books Count</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="e.g., 5"
                  className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all"
                  {...field}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};