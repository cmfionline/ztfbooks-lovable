import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ContentBlockFormValues } from "../types";

interface ButtonFieldsProps {
  form: UseFormReturn<ContentBlockFormValues>;
}

export const ButtonFields = ({ form }: ButtonFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="button_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Button Text</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="button_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Button Link</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};