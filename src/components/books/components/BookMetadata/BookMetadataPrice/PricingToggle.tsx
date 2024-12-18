import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";

interface PricingToggleProps {
  control: Control<any>;
  name: string;
  label: string;
  description?: string;
}

export const PricingToggle = ({ control, name, label, description }: PricingToggleProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-primary">{label}</FormLabel>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};