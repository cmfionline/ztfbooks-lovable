import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Control } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.string().min(2, "Type must be at least 2 characters"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface AdTypeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  control?: Control<FormValues>;
}

export const AdTypeForm = ({ onSuccess, onCancel, control }: AdTypeFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  });

  const localControl = control || form.control;

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase
        .from('ad_types')
        .insert([values]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ad type created successfully",
      });
      
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating ad type:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ad type",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={localControl}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Banner Ad" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={localControl}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type Identifier</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., banner" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={localControl}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional description..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit"
            className="flex-1 bg-purple hover:bg-purple/90 text-white"
          >
            Create Ad Type
          </Button>
        </div>
      </form>
    </Form>
  );
};