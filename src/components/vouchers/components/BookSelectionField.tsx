import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface BookSelectionFieldProps {
  form: UseFormReturn<any>;
  books: any[];
}

export const BookSelectionField = ({ form, books }: BookSelectionFieldProps) => {
  if (form.watch("type") !== "single_book") return null;

  return (
    <FormField
      control={form.control}
      name="bookId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Book</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
            </FormControl>
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