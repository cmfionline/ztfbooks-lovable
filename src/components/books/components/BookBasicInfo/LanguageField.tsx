import { Control } from "react-hook-form";
import { Link } from "react-router-dom";
import { PlusCircle, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LanguageFieldProps {
  control: Control<any>;
  languages: { label: string; value: string; }[];
}

export const LanguageField = ({ control, languages = [] }: LanguageFieldProps) => {
  return (
    <FormField
      control={control}
      name="languageId"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel className="text-primary">Language</FormLabel>
            <Link 
              to="/books/languages/add"
              className="text-sm text-purple hover:text-purple-dark flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              Add Language
            </Link>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between border-purple-light focus:border-purple",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? languages.find((item) => item.value === field.value)?.label
                    : "Select language"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search languages..." />
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => field.onChange(item.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
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