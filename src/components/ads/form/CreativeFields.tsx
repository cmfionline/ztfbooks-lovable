import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { AdFormValues } from "../schema";

interface CreativeFieldsProps {
  control: Control<AdFormValues>;
}

export const CreativeFields = ({ control }: CreativeFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea placeholder="Ad content or description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="html_content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>HTML Content (Optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="Custom HTML content" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="video_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video URL (Optional)</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="preview_mobile_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile Preview URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="preview_tablet_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tablet Preview URL</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};