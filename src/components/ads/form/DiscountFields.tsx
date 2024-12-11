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
                <SelectItem value="percentage">Percentage Discount</SelectItem>
                <SelectItem value="fixed">Fixed Amount Discount</SelectItem>
                <SelectItem value="volume">Volume Discount</SelectItem>
                <SelectItem value="cart">Cart Value Discount</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Choose how the discount will be applied
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="discount_value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Value</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                step={field.value === "percentage" ? "0.01" : "1"}
                placeholder={field.value === "percentage" ? "e.g., 15 for 15%" : "Amount"}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="min_purchase_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Purchase Amount</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                placeholder="e.g., 50"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Minimum cart value required for the discount to apply
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="min_books_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Books Count</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                placeholder="e.g., 5"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Minimum number of books required for volume discount
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="is_stackable"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Stackable Discount</FormLabel>
              <FormDescription>
                Allow this discount to be combined with other active discounts
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