import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface SynopsisFieldProps {
  control: Control<any>;
}

export const SynopsisField = ({ control }: SynopsisFieldProps) => {
  return (
    <FormField
      control={control}
      name="synopsis"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary">Synopsis</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              className="min-h-[120px] border-purple-light focus:border-purple focus:ring-purple"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};