import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface BookSelectionFieldProps {
  form: UseFormReturn<any>;
  books: { id: string; title: string; }[];
}

export const BookSelectionField = ({ form, books }: BookSelectionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="bookId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Book</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select a book" />
            </SelectTrigger>
            <SelectContent>
              {books?.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title}
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