import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PublisherBasicInfoProps {
  control: Control<any>;
}

export const PublisherBasicInfo = ({ control }: PublisherBasicInfoProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel className="text-primary">Name*</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="border-purple-light focus:border-purple focus:ring-purple"
                placeholder="Enter publisher name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Email</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="email"
                className="border-purple-light focus:border-purple focus:ring-purple"
                placeholder="publisher@example.com"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Phone</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="tel"
                className="border-purple-light focus:border-purple focus:ring-purple"
                placeholder="+1234567890"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};