import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
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
            <FormLabel className="flex items-center gap-1">
              Content
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter your ad content or description" 
                className="resize-none h-24 focus:ring-2 focus:ring-primary/20 transition-all"
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="html_content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>HTML Content</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Custom HTML content (optional)" 
                className="resize-none h-24 font-mono text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
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
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                    file:text-sm file:font-medium file:bg-primary/10 hover:file:bg-primary/20 
                    focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer
                    border-2 hover:border-primary/20"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Accepts JPG, PNG, WebP up to 5MB
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="video_file"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Video</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept=".mp4,.webm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onChange(file);
                  }}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                    file:text-sm file:font-medium file:bg-primary/10 hover:file:bg-primary/20 
                    focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer
                    border-2 hover:border-primary/20"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Accepts MP4, WebM up to 5MB
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="cta_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Call to Action</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Learn More, Shop Now" 
                className="focus:ring-2 focus:ring-primary/20 transition-all"
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};