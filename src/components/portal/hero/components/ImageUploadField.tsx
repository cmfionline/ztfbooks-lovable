import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ImageUploadFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  currentImage?: string;
}

export const ImageUploadField = ({ control, name, label, currentImage }: ImageUploadFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange(file);
              }}
              {...field}
              value={undefined}
              className="file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
            />
          </FormControl>
          {currentImage && (
            <img
              src={currentImage}
              alt="Current hero image"
              className="mt-2 max-w-xs rounded-lg"
            />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};