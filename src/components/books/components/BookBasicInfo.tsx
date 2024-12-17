import { Control } from "react-hook-form";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface BookBasicInfoProps {
  control: Control<any>;
  series: { label: string; value: string }[];
  languages: { label: string; value: string }[];
}

export const BookBasicInfo = ({
  control,
  series = [],
  languages = [],
}: BookBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Title</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="border-purple-light focus:border-purple focus:ring-purple"
              />
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

      <FormField
        control={control}
        name="synopsis"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Synopsis</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="min-h-[120px] border-purple-light focus:border-purple focus:ring-purple"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};