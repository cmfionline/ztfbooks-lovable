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

interface BookMetadataPublisherProps {
  control: Control<any>;
  publishers: { label: string; value: string }[];
}

export const BookMetadataPublisher = ({ control, publishers = [] }: BookMetadataPublisherProps) => {
  return (
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
              <SelectItem value="null">None</SelectItem>
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
  );
};