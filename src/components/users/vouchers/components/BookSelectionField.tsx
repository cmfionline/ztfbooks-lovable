import { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookSelectionFieldProps {
  form: UseFormReturn<any>;
  books: { id: string; title: string; }[];
}

export const BookSelectionField = ({ form, books }: BookSelectionFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name="bookId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Select Book</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {field.value
                  ? books.find((book) => book.id === field.value)?.title
                  : "Select book..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search books..." />
                <CommandEmpty>No book found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {books.map((book) => (
                    <CommandItem
                      key={book.id}
                      value={book.title}
                      onSelect={() => {
                        form.setValue("bookId", book.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === book.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {book.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};