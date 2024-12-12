import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { NewTicketFormData } from "./types";

export const TICKET_PRIORITIES = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
] as const;

interface PrioritySelectProps {
  form: UseFormReturn<NewTicketFormData>;
}

export const PrioritySelect = ({ form }: PrioritySelectProps) => {
  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-foreground">Priority</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full border-purple/20 focus:border-purple bg-white text-foreground">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {TICKET_PRIORITIES.map((priority) => (
                  <SelectItem 
                    key={priority.value} 
                    value={priority.value}
                    className="cursor-pointer hover:bg-purple/10"
                  >
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};