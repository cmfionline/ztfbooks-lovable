import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GlobalSettingsData } from "../types";

interface BasicInfoFieldsProps {
  form: UseFormReturn<GlobalSettingsData>;
}

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="site_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Site Name</FormLabel>
            <FormControl>
              <Input {...field} className="h-9" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Support Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} className="h-9" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="support_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Support Phone</FormLabel>
            <FormControl>
              <Input {...field} className="h-9" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};