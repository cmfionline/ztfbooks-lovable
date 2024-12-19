import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { AdTypeFormValues } from "./schema";

interface AdTypeFormProps {
  control: Control<AdTypeFormValues>;
}

export const AdTypeForm = ({ control }: AdTypeFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Banner Ad" {...field} />
            </FormControl>
            <FormDescription>
              A descriptive name for this ad type
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type Identifier</FormLabel>
            <FormControl>
              <Input placeholder="e.g., banner" {...field} />
            </FormControl>
            <FormDescription>
              A unique identifier using only lowercase letters, numbers, and underscores
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe this ad type..." 
                className="resize-none h-20"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Optional description of this ad type's purpose and usage
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Control whether this ad type is available for use
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};