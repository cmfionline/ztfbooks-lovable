import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { AdFormValues } from "../schema";

interface DiscountFieldsProps {
  control: Control<AdFormValues>;
}

export const DiscountFields = ({ control }: DiscountFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="discount_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="percentage">Percentage Off</SelectItem>
                <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                <SelectItem value="volume">Volume Discount</SelectItem>
                <SelectItem value="cart">Cart Value Discount</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs">
              Choose how the discount will be applied
            </FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="discount_value"
          render={({ field: { value, onChange, ...field }, formState }) => (
            <FormItem>
              <FormLabel>Discount Value</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step={formState.defaultValues?.discount_type === "percentage" ? "0.01" : "1"}
                  placeholder={formState.defaultValues?.discount_type === "percentage" ? "e.g., 15 for 15%" : "Amount"}
                  {...field}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="min_purchase_amount"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Min. Purchase</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="e.g., 50"
                  {...field}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="min_books_count"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Min. Books Count</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                placeholder="e.g., 5"
                {...field}
                value={value || ""}
                onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
              />
            </FormControl>
            <FormDescription className="text-xs">
              Minimum number of books required for volume discount
            </FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="is_stackable"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
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
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};