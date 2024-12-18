import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Percent } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface BookMetadataPriceProps {
  control: Control<any>;
}

export const BookMetadataPrice = ({ control }: BookMetadataPriceProps) => {
  return (
    <>
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
        <>
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

          <FormField
            control={control}
            name="discount_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Discount Percentage</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border-purple-light focus:border-purple pr-10"
                    />
                    <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="discount_start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
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
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="discount_end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
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
                          date < new Date() || (control._formValues.discount_start_date && date < control._formValues.discount_start_date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </>
  );
};