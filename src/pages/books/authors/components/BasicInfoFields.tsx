import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AuthorFormValues } from "../schema";

type BasicInfoFieldsProps = {
  form: UseFormReturn<AuthorFormValues>;
};

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel className="text-primary">Name*</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="border-purple-light focus:border-purple"
                placeholder="Enter author's name"
                autoFocus
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nationality</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter nationality" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="date_of_birth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="photo"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Photo URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter photo URL" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Biography</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter author's biography"
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};