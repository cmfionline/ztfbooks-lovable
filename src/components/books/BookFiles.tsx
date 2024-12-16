import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BookFilesProps {
  control: Control<any>;
  maxFileSize?: number;
  acceptedImageTypes?: string[];
  acceptedEpubTypes?: string[];
}

export const BookFiles = ({ 
  control,
  maxFileSize = 5 * 1024 * 1024, // Default 5MB
  acceptedImageTypes = ['image/*'],
  acceptedEpubTypes = ['.epub']
}: BookFilesProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="coverImage"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel className="text-primary">Cover Image (300x450)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept={acceptedImageTypes.join(',')}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.size <= maxFileSize) {
                    onChange(file);
                  }
                }}
                {...field}
                className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="epubFile"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel className="text-primary">EPUB File</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept={acceptedEpubTypes.join(',')}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.size <= maxFileSize) {
                    onChange(file);
                  }
                }}
                {...field}
                className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};