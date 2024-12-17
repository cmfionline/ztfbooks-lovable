import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TitleFieldProps {
  control: Control<any>;
}

export const TitleField = ({ control }: TitleFieldProps) => {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary">Title</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              className="border-purple-light focus:border-purple focus:ring-purple"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};