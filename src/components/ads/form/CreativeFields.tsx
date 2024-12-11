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
        name="image_file"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <Input 
                type="file" 
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(file);
                }}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="video_file"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Video (Optional)</FormLabel>
            <FormControl>
              <Input 
                type="file" 
                accept=".mp4,.webm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(file);
                }}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cta_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Call to Action Text</FormLabel>
            <FormControl>
              <Input placeholder="Learn More" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};