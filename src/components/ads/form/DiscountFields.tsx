import { Control } from "react-hook-form";
import { AdFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscountFieldsProps {
  control: Control<AdFormValues>;
}

export const DiscountFields = ({ control }: DiscountFieldsProps) => {
  const { data: discountStrategies, isLoading } = useQuery({
    queryKey: ['discountStrategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_strategies')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="discount_strategy_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
              Discount Strategy
            </FormLabel>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all">
                    <SelectValue placeholder="Select a discount strategy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {discountStrategies?.map((strategy) => (
                    <SelectItem 
                      key={strategy.id} 
                      value={strategy.id}
                      className="hover:bg-purple-light/50"
                    >
                      {strategy.name} ({strategy.type} - {strategy.value}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <FormDescription className="text-xs text-gray-500">
              Select an existing discount strategy or create one in the Discount Strategies section
            </FormDescription>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};