import { Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BookMetadataPriceProps {
  control: Control<any>;
}

export const BookMetadataPrice = ({ control }: BookMetadataPriceProps) => {
  return (
    <>
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

      {!control._formValues.isFree && (
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
      )}
    </>
  );
};