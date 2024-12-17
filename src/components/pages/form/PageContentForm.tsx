import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { PageFormValues } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageContentFormProps {
  control: Control<PageFormValues>;
}

export const PageContentForm = ({ control }: PageContentFormProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Enter page title"
                className="border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20"
                aria-describedby="title-error"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Content</FormLabel>
            <FormControl>
              <RichTextEditor 
                value={field.value} 
                onChange={field.onChange}
                placeholder="Enter page content"
                className="min-h-[200px]"
                aria-describedby="content-error"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-gray-200 focus:border-purple">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="order_index"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">Order</FormLabel>
            <FormControl>
              <Input 
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                min={0}
                className="border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20"
                aria-describedby="order-error"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};