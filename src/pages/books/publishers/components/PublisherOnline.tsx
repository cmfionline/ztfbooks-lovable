import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PublisherOnlineProps {
  control: Control<any>;
}

export const PublisherOnline = ({ control }: PublisherOnlineProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Website</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="url"
                className="border-purple-light focus:border-purple focus:ring-purple"
                placeholder="https://example.com"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="socialMediaUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Social Media URL</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="url"
                className="border-purple-light focus:border-purple focus:ring-purple"
                placeholder="https://social-media.com/publisher"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};