import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { AdFormValues } from "../schema";
import { format } from "date-fns";

interface SchedulingFieldsProps {
  control: Control<AdFormValues>;
}

export const SchedulingFields = ({ control }: SchedulingFieldsProps) => {
  const now = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <Input 
                type="datetime-local" 
                defaultValue={now}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date</FormLabel>
            <FormControl>
              <Input 
                type="datetime-local" 
                min={field.value || now}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};