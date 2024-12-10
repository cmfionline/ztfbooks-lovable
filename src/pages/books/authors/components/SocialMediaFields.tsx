import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AuthorFormValues } from "../schema";

type SocialMediaFieldsProps = {
  form: UseFormReturn<AuthorFormValues>;
};

export const SocialMediaFields = ({ form }: SocialMediaFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="facebook_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://facebook.com/..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="twitter_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twitter</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://twitter.com/..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="instagram_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://instagram.com/..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};