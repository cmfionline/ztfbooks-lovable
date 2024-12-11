import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface BookMultiSelectProps {
  form: UseFormReturn<any>;
  books: any[];
  selectedBooks: string[];
  setSelectedBooks: (books: string[]) => void;
}

export const BookMultiSelect = ({ form, books, selectedBooks, setSelectedBooks }: BookMultiSelectProps) => {
  return (
    <FormItem className="space-y-4">
      <FormLabel>Select Books</FormLabel>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedBooks.map((bookId) => {
          const book = books?.find((b) => b.id === bookId);
          return book ? (
            <Badge
              key={bookId}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {book.title}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
                }}
              />
            </Badge>
          ) : null;
        })}
      </div>
      <Select
        onValueChange={(value) => {
          if (!selectedBooks.includes(value)) {
            setSelectedBooks([...selectedBooks, value]);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select books" />
        </SelectTrigger>
        <SelectContent>
          {books
            ?.filter((book) => !selectedBooks.includes(book.id))
            .map((book) => (
              <SelectItem key={book.id} value={book.id}>
                {book.title}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};