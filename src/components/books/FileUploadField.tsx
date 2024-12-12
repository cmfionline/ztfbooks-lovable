import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface FileUploadFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  accept?: string;
  helperText?: string;
}

export const FileUploadField = ({ control, name, label, accept, helperText }: FileUploadFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel className="text-primary">{label}</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange(file);
                }
              }}
              {...field}
              value={field.value?.filename || ''}
              className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
            />
          </FormControl>
          {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};