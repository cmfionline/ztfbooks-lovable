import { Control } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface BookMetadataLanguageProps {
  control: Control<any>;
}

export const BookMetadataLanguage = ({ control }: BookMetadataLanguageProps) => {
  const { data: languages = [] } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <FormField
      control={control}
      name="languageId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-primary">Language</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between border-purple-light hover:bg-purple-light/50",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? languages.find((language) => language.id === field.value)
                        ?.name
                    : "Select language"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((language) => (
                    <CommandItem
                      key={language.id}
                      value={language.name}
                      onSelect={() => {
                        field.onChange(language.id);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          language.id === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {language.name}
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