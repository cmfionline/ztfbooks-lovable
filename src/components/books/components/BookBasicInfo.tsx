import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllLanguages, formatLanguageLabel } from "@/utils/languages";

interface BookBasicInfoProps {
  control: Control<any>;
  series: { label: string; value: string }[];
  languages: { label: string; value: string }[];
}

export const BookBasicInfo = ({
  control,
  series,
  languages,
}: BookBasicInfoProps) => {
  const availableLanguages = getAllLanguages();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Title</FormLabel>
            <FormControl>
              <Input {...field} className="border-purple-light focus:border-purple" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="seriesId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Series</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between border-purple-light focus:border-purple"
                  >
                    {field.value
                      ? series.find((series) => series.value === field.value)?.label
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

      <FormField
        control={control}
        name="languageId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Language</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between border-purple-light focus:border-purple"
                  >
                    {field.value
                      ? formatLanguageLabel(
                          availableLanguages.find((lang) => lang.code === field.value)?.name || "",
                          field.value
                        )
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
                    {availableLanguages.map((lang) => (
                      <CommandItem
                        key={lang.code}
                        value={lang.code}
                        onSelect={() => field.onChange(lang.code)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === lang.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {formatLanguageLabel(lang.name, lang.code)}
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
    </div>
  );
};