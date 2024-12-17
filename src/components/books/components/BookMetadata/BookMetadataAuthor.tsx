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

interface BookMetadataAuthorProps {
  control: Control<any>;
  authors: { label: string; value: string }[];
}

export const BookMetadataAuthor = ({ control, authors = [] }: BookMetadataAuthorProps) => {
  return (
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
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger className="border-purple-light focus:border-purple">
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {authors.map((item) => (
                <SelectItem 
                  key={item.value} 
                  value={item.value}
                  className="hover:bg-purple-50 text-foreground"
                >
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