import { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeriesSelectionFieldProps {
  form: UseFormReturn<any>;
  series: { id: string; name: string; }[];
}

export const SeriesSelectionField = ({ form, series }: SeriesSelectionFieldProps) => {
  const [open, setOpen] = useState(false);

  if (form.watch("type") !== "series") return null;

  return (
    <FormField
      control={form.control}
      name="seriesId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Select Series</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {field.value
                  ? series.find((s) => s.id === field.value)?.name
                  : "Select series..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search series..." />
                <CommandEmpty>No series found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {series.map((s) => (
                    <CommandItem
                      key={s.id}
                      value={s.name}
                      onSelect={() => {
                        form.setValue("seriesId", s.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === s.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {s.name}
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