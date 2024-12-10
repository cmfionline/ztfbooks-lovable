import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SeriesImageProps {
  control: Control<any>;
}

export const SeriesImage = ({ control }: SeriesImageProps) => {
  return (
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
              onChange={(e) => onChange(e.target.files)}
              {...field}
              className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};