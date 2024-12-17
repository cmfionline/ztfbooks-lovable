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

interface SeriesFieldProps {
  control: Control<any>;
  series: { label: string; value: string; }[];
}

export const SeriesField = ({ control, series = [] }: SeriesFieldProps) => {
  return (
    <FormField
      control={control}
      name="seriesId"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel className="text-primary">Series</FormLabel>
            <Link 
              to="/books/series/add"
              className="text-sm text-purple hover:text-purple-dark flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              Add Series
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
                    ? series.find((item) => item.value === field.value)?.label
                    : "Select series"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search series..." />
                <CommandEmpty>No series found.</CommandEmpty>
                <CommandGroup>
                  {series.map((item) => (
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