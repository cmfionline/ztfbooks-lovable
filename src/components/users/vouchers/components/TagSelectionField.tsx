import { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagSelectionFieldProps {
  form: UseFormReturn<any>;
  tags: { id: string; name: string; }[];
}

export const TagSelectionField = ({ form, tags }: TagSelectionFieldProps) => {
  const [open, setOpen] = useState(false);

  if (form.watch("type") !== "book_tag") return null;

  return (
    <FormField
      control={form.control}
      name="tagId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Select Tag</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {field.value
                  ? tags.find((tag) => tag.id === field.value)?.name
                  : "Select tag..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandEmpty>No tag found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {tags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => {
                        form.setValue("tagId", tag.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === tag.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tag.name}
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