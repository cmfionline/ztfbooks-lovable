import { Control } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuthorField } from "./BookMetadata/AuthorField";
import { PublisherField } from "./BookMetadata/PublisherField";
import { PricingFields } from "./BookMetadata/PricingFields";

interface BookMetadataProps {
  control: Control<any>;
  authors: { label: string; value: string }[];
  publishers: { label: string; value: string }[];
}

export const BookMetadata = ({
  control,
  authors,
  publishers,
}: BookMetadataProps) => {
  return (
    <div className="space-y-6">
      <AuthorField control={control} authors={authors} />
      <PublisherField control={control} publishers={publishers} />

      <FormField
        control={control}
        name="publicationDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-primary">Publication Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal border-purple-light hover:bg-purple-light/50",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <PricingFields control={control} />
    </div>
  );
};