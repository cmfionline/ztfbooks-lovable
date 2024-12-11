import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { AdFormValues } from "../../schema";
import { useAdConfigurations } from "@/hooks/useAdConfigurations";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscountTypeFieldProps {
  control: Control<AdFormValues>;
}

export const DiscountTypeField = ({ control }: DiscountTypeFieldProps) => {
  const { discountStrategies, isLoading } = useAdConfigurations();

  return (
    <FormField
      control={control}
      name="discount_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
            Discount Type
            <span className="text-red-500">*</span>
          </FormLabel>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {discountStrategies?.map((strategy) => (
                  <SelectItem 
                    key={strategy.id} 
                    value={strategy.type}
                    className="hover:bg-purple-light/50"
                  >
                    {strategy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <FormDescription className="text-xs text-gray-500">
            Choose how the discount will be applied
          </FormDescription>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};