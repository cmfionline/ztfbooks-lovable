import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { NotifyNewDiscount } from "@/components/notifications/NotifyNewDiscount";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { discountStrategySchema, type DiscountStrategyFormValues } from "../schema";
import { DiscountStrategyBasicInfo } from "./DiscountStrategyBasicInfo";
import { DiscountStrategyRules } from "./DiscountStrategyRules";
import { DiscountDateFields } from "./DiscountDateFields";

export type DiscountStrategyFormProps = {
  onSubmit?: (values: DiscountStrategyFormValues) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  editingStrategy?: any;
};

export const DiscountStrategyForm = ({ onSubmit, onSuccess, onCancel, editingStrategy }: DiscountStrategyFormProps) => {
  const [newDiscount, setNewDiscount] = useState<any>(null);
  
  const form = useForm<DiscountStrategyFormValues>({
    resolver: zodResolver(discountStrategySchema),
    defaultValues: {
      name: editingStrategy?.name || "",
      type: editingStrategy?.type || "percentage",
      value: editingStrategy?.value || 0,
      min_purchase_amount: editingStrategy?.min_purchase_amount || 0,
      min_books_count: editingStrategy?.min_books_count || 0,
      is_stackable: editingStrategy?.is_stackable || false,
      start_date: editingStrategy?.start_date || "",
      end_date: editingStrategy?.end_date || "",
    },
  });

  const handleSubmit = async (values: DiscountStrategyFormValues) => {
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
        <DiscountStrategyBasicInfo control={form.control} />
        <DiscountStrategyRules control={form.control} discountType={form.watch("type")} />
        <DiscountDateFields control={form.control} />

        {newDiscount && (
          <NotifyNewDiscount
            discountName={newDiscount.name}
            discountId={newDiscount.id}
            discountValue={newDiscount.value}
            discountType={newDiscount.type}
          />
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