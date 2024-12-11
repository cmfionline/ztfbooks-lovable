import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NotifyNewDiscount } from "@/components/notifications/NotifyNewDiscount";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  value: z.number().min(0, "Value must be greater than or equal to 0"),
  type: z.enum(["percentage", "fixed"]),
  books: z.array(z.object({
    title: z.string(),
  })).optional(),
});

type DiscountStrategyFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
};

export const DiscountStrategyForm = ({ onSubmit }: DiscountStrategyFormProps) => {
  const [newDiscount, setNewDiscount] = useState<any>(null);
  const [affectedBooks, setAffectedBooks] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: 0,
      type: "fixed",
      books: [],
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await onSubmit(values);
      
      // After successful submission, store the new discount data
      setNewDiscount({
        id: result.data.id,
        name: values.name,
        value: values.value,
        type: values.type
      });
      
      // Store affected book titles
      setAffectedBooks(values.books?.map(book => book.title) || []);
      
    } catch (error) {
      console.error("Error creating discount:", error);
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

        {/* Additional fields for selecting books can be added here */}

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
          <Button type="button" variant="outline" className="flex-1" onClick={() => { /* handle cancel */ }}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-purple hover:bg-purple/90 text-white">
            Create Discount
          </Button>
        </div>
      </form>
    </Form>
  );
};
