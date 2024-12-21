import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface TagSelectionFieldProps {
  form: UseFormReturn<any>;
  tags: { id: string; name: string; }[];
}

export const TagSelectionField = ({ form, tags }: TagSelectionFieldProps) => {
  if (form.watch("type") !== "book_tag") return null;

  return (
    <FormField
      control={form.control}
      name="tagId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Tag</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select a tag" />
            </SelectTrigger>
            <SelectContent>
              {tags?.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};