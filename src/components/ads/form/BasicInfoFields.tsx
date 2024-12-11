import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { AdFormValues } from "../schema";
import { useAdConfigurations } from "@/hooks/useAdConfigurations";
import { Skeleton } from "@/components/ui/skeleton";

interface BasicInfoFieldsProps {
  control: Control<AdFormValues>;
}

export const BasicInfoFields = ({ control }: BasicInfoFieldsProps) => {
  const { adTypes, isLoading } = useAdConfigurations();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Campaign Name
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Summer Sale 2024" 
                className="focus:ring-2 focus:ring-primary/20 transition-all"
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Type
                <span className="text-red-500">*</span>
              </FormLabel>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary/20 transition-all">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {adTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.type}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="placement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Placement
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="focus:ring-2 focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="checkout">Checkout</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};