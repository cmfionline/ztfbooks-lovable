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
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SeriesLanguageProps {
  control: Control<any>;
}

export const SeriesLanguage = ({ control }: SeriesLanguageProps) => {
  const { data: languages = [], isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching languages:", error);
        return [];
      }

      return (data || []).map((language) => ({
        label: `${language.name} (${language.code})`,
        value: language.id,
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
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
  );
};