import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { AdFormValues } from "../schema";

interface BasicInfoFieldsProps {
  control: Control<AdFormValues>;
}

export const BasicInfoFields = ({ control }: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Campaign Name</FormLabel>
            <FormControl>
              <Input placeholder="Summer Sale 2024" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="banner">Banner</SelectItem>
                <SelectItem value="interstitial">Interstitial</SelectItem>
                <SelectItem value="popup">Popup</SelectItem>
                <SelectItem value="sponsored">Sponsored</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="placement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placement</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="checkout">Checkout</SelectItem>
                <SelectItem value="series">Series</SelectItem>
                <SelectItem value="book">Book</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};