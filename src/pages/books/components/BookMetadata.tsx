import { Control } from "react-hook-form";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BookMetadataProps {
  control: Control<any>;
  authors: { label: string; value: string; }[];
  publishers: { label: string; value: string; }[];
}

export const BookMetadata = ({
  control,
  authors,
  publishers,
}: BookMetadataProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="authorId"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel className="text-primary">Author</FormLabel>
              <Link 
                to="/books/authors/add"
                className="text-sm text-purple hover:text-purple-dark flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                Add Author
              </Link>
            </div>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="border-purple-light focus:border-purple">
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {authors.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="publisherId"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel className="text-primary">Publisher</FormLabel>
              <Link 
                to="/books/publishers/add"
                className="text-sm text-purple hover:text-purple-dark flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                Add Publisher
              </Link>
            </div>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="border-purple-light focus:border-purple">
                  <SelectValue placeholder="Select a publisher" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {publishers.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="pageCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Page Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="border-purple-light focus:border-purple"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isFree"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Pricing</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant={field.value ? "default" : "outline"}
                    onClick={() => field.onChange(true)}
                    className={cn(
                      field.value 
                        ? "bg-purple text-white hover:bg-purple/90" 
                        : "border-purple-light hover:bg-purple-light/50"
                    )}
                  >
                    Free
                  </Button>
                  <Button
                    type="button"
                    variant={!field.value ? "default" : "outline"}
                    onClick={() => field.onChange(false)}
                    className={cn(
                      !field.value 
                        ? "bg-purple text-white hover:bg-purple/90" 
                        : "border-purple-light hover:bg-purple-light/50"
                    )}
                  >
                    Paid
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!control._formValues.isFree && (
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-purple-light focus:border-purple"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};