import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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
      <FormField
        control={control}
        name="authorId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Author</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger className="border-purple-light focus:border-purple bg-white text-gray-900">
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {authors.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="publisherId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Publisher</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger className="border-purple-light focus:border-purple bg-white text-gray-900">
                  <SelectValue placeholder="Select a publisher" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {publishers.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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