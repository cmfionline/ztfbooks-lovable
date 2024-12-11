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
            <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
              Campaign Name
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Summer Sale 2024" 
                className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all"
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
              <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
                Type
                <span className="text-red-500">*</span>
              </FormLabel>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {adTypes?.map((type) => (
                      <SelectItem 
                        key={type.type} 
                        value={type.type}
                        className="hover:bg-purple-light/50"
                      >
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
              <FormLabel className="flex items-center gap-1 text-gray-700 font-medium">
                Placement
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/20 transition-all">
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="home" className="hover:bg-purple-light/50">Home</SelectItem>
                  <SelectItem value="category" className="hover:bg-purple-light/50">Category</SelectItem>
                  <SelectItem value="checkout" className="hover:bg-purple-light/50">Checkout</SelectItem>
                  <SelectItem value="series" className="hover:bg-purple-light/50">Series</SelectItem>
                  <SelectItem value="book" className="hover:bg-purple-light/50">Book</SelectItem>
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