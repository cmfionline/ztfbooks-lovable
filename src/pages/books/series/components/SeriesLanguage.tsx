import { Control } from "react-hook-form";
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
import { getAllLanguages, formatLanguageLabel } from "@/utils/languages";

interface SeriesLanguageProps {
  control: Control<any>;
}

export const SeriesLanguage = ({ control }: SeriesLanguageProps) => {
  const availableLanguages = getAllLanguages();

  return (
    <FormField
      control={control}
      name="languageId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary">Language</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white border-purple-light focus:border-purple">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {formatLanguageLabel(lang.name, lang.code)}
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