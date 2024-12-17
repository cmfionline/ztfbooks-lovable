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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          <Select 
            onValueChange={(value) => field.onChange(value === "none" ? null : value)}
            value={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger className="border-purple-light focus:border-purple bg-white">
                <SelectValue placeholder="Select series" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              <SelectItem value="none">None</SelectItem>
              {series.map((item) => (
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
  );
};