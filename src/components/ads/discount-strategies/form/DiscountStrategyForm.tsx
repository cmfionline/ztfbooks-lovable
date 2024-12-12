import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NotifyNewDiscount } from "@/components/notifications/NotifyNewDiscount";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  value: z.number().min(0, "Value must be greater than or equal to 0"),
  type: z.enum(["percentage", "fixed"]),
  books: z.array(z.object({
    title: z.string(),
  })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export type DiscountStrategyFormProps = {
  onSubmit?: (values: FormValues) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  editingStrategy?: any;
};

export const DiscountStrategyForm = ({ onSubmit, onSuccess, onCancel, editingStrategy }: DiscountStrategyFormProps) => {
  const [newDiscount, setNewDiscount] = useState<any>(null);
  const [affectedBooks, setAffectedBooks] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingStrategy?.name || "",
      value: editingStrategy?.value || 0,
      type: editingStrategy?.type || "fixed",
      books: [],
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
        return;
      }

      const { data, error } = await supabase
        .from('discount_strategies')
        .upsert([{
          ...values,
          ...(editingStrategy?.id ? { id: editingStrategy.id } : {})
        }])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setNewDiscount({
          id: data.id,
          name: values.name,
          value: values.value,
          type: values.type
        });
        
        setAffectedBooks(values.books?.map(book => book.title) || []);
        
        toast({
          title: "Success",
          description: `Discount strategy ${editingStrategy ? 'updated' : 'created'} successfully`,
        });

        onSuccess?.();
      }
      
    } catch (error) {
      console.error("Error creating discount:", error);
      toast({
        title: "Error",
        description: "Failed to save discount strategy",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Discount Name</FormLabel>
              <FormControl>
                <input {...field} className="border-purple-light focus:border-purple focus:ring-purple" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Discount Value</FormLabel>
              <FormControl>
                <input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="border-purple-light focus:border-purple focus:ring-purple"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Discount Type</FormLabel>
              <FormControl>
                <select {...field} className="border-purple-light focus:border-purple focus:ring-purple">
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {newDiscount && (
          <div className="mt-4 flex justify-end">
            <NotifyNewDiscount
              discountName={newDiscount.name}
              discountId={newDiscount.id}
              discountValue={newDiscount.value}
              discountType={newDiscount.type}
              bookTitles={affectedBooks}
            />
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-purple hover:bg-purple/90 text-white">
            {editingStrategy ? 'Update' : 'Create'} Discount
          </Button>
        </div>
      </form>
    </Form>
  );
};