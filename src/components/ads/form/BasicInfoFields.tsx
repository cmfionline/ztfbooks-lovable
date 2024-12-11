import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
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
            <FormLabel className="flex items-center gap-1">
              Campaign Name
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g., Summer Sale 2024" {...field} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Type
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="interstitial">Interstitial</SelectItem>
                  <SelectItem value="popup">Popup</SelectItem>
                  <SelectItem value="sponsored">Sponsored</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="placement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Placement
                <span className="text-red-500">*</span>
              </FormLabel>
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
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};