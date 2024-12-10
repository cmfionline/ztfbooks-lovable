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
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { Textarea } from "@/components/ui/textarea";

interface BookBasicInfoProps {
  control: Control<any>;
  series: { label: string; value: string; }[];
  languages: { label: string; value: string; }[];
  onCreateSeries: (name: string) => Promise<{ id: string } | undefined>;
}

export const BookBasicInfo = ({
  control,
  series,
  languages,
  onCreateSeries,
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
            <FormControl>
              <CreatableCombobox
                value={field.value}
                options={series}
                onChange={field.onChange}
                onCreateOption={async (name) => {
                  const newSeries = await onCreateSeries(name);
                  field.onChange(newSeries?.id);
                }}
                placeholder="Select or create a series"
                className="border-purple-light focus:border-purple"
              />
            </FormControl>
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
            <FormControl>
              <CreatableCombobox
                value={field.value}
                options={languages}
                onChange={field.onChange}
                onCreateOption={() => {}}
                placeholder="Select a language"
                className="border-purple-light focus:border-purple"
              />
            </FormControl>
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