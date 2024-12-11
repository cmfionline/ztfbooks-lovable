import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface SeriesSelectionFieldProps {
  form: UseFormReturn<any>;
  series: any[];
}

export const SeriesSelectionField = ({ form, series }: SeriesSelectionFieldProps) => {
  if (form.watch("type") !== "series") return null;

  return (
    <FormField
      control={form.control}
      name="seriesId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Series</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white border-purple-light focus:border-purple">
                <SelectValue placeholder="Select a series" className="text-foreground" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {series?.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
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