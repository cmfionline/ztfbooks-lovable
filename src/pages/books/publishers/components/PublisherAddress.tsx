import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PublisherAddressProps {
  control: Control<any>;
}

export const PublisherAddress = ({ control }: PublisherAddressProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Address</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="min-h-[80px] border-purple-light focus:border-purple focus:ring-purple"
                placeholder="Enter complete address"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">City</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="border-purple-light focus:border-purple focus:ring-purple"
                  placeholder="City"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Country</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="border-purple-light focus:border-purple focus:ring-purple"
                  placeholder="Country"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Postcode</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="border-purple-light focus:border-purple focus:ring-purple"
                  placeholder="Postal code"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};