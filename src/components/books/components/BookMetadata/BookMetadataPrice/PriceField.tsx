import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface PriceFieldProps {
  control: Control<any>;
}

export const PriceField = ({ control }: PriceFieldProps) => {
  return (
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
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="border-purple-light focus:border-purple"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};