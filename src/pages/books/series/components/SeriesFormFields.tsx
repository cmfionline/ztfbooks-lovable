import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SeriesLanguage } from "./SeriesLanguage";

interface SeriesFormFieldsProps {
  control: Control<any>;
}

export const SeriesFormFields = ({ control }: SeriesFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Name</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="border-purple-light focus:border-purple focus:ring-purple"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Description</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="min-h-[120px] border-purple-light focus:border-purple focus:ring-purple"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <SeriesLanguage control={control} />

      <FormField
        control={control}
        name="image"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel className="text-primary">Series Image</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                  }
                }}
                {...field}
                className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
              />
            </FormControl>
            {value && typeof value === 'string' && (
              <img 
                src={value} 
                alt="Current series image" 
                className="mt-2 h-32 w-auto object-contain rounded-md"
              />
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};