import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BookMetadataAuthor } from "./BookMetadataAuthor";
import { BookMetadataPublisher } from "./BookMetadataPublisher";
import { BookMetadataDate } from "./BookMetadataDate";

interface BookMetadataProps {
  control: Control<any>;
  authors: { label: string; value: string }[];
  publishers: { label: string; value: string }[];
}

export const BookMetadata = ({
  control,
  authors,
  publishers,
}: BookMetadataProps) => {
  return (
    <div className="space-y-4">
      <BookMetadataAuthor control={control} authors={authors} />
      <BookMetadataPublisher control={control} publishers={publishers} />
      <BookMetadataDate control={control} />

      <FormField
        control={control}
        name="isFree"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel className="text-primary">Free Book</FormLabel>
              <p className="text-sm text-gray-500">Make this book available for free</p>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                disabled={field.value === true}
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="border-purple-light focus:border-purple bg-white text-gray-900"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};