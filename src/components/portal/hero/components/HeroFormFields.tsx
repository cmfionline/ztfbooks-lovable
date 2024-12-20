import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ImageUploadField } from "./ImageUploadField";

interface HeroFormFieldsProps {
  control: Control<any>;
  heroImage?: string;
}

export const HeroFormFields = ({ control, heroImage }: HeroFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="subtitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtitle</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="primary_button_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Button Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="primary_button_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Button Link</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="secondary_button_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Button Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="secondary_button_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Button Link</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="app_store_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App Store Link</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="play_store_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Play Store Link</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <ImageUploadField
        control={control}
        name="hero_image"
        label="Hero Image"
        currentImage={heroImage}
      />
    </div>
  );
};