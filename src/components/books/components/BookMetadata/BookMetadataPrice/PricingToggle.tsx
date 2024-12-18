import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";

interface PricingToggleProps {
  control: Control<any>;
}

export const PricingToggle = ({ control }: PricingToggleProps) => {
  return (
    <FormField
      control={control}
      name="isFree"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary">Pricing</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant={field.value ? "default" : "outline"}
                onClick={() => field.onChange(true)}
                className={cn(
                  field.value 
                    ? "bg-purple text-white hover:bg-purple/90" 
                    : "border-purple-light hover:bg-purple-light/50"
                )}
              >
                Free
              </Button>
              <Button
                type="button"
                variant={!field.value ? "default" : "outline"}
                onClick={() => field.onChange(false)}
                className={cn(
                  !field.value 
                    ? "bg-purple text-white hover:bg-purple/90" 
                    : "border-purple-light hover:bg-purple-light/50"
                )}
              >
                Paid
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};