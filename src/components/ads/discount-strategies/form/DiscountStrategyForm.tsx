import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { discountStrategySchema, type DiscountStrategyFormValues } from "../schema";
import { DiscountStrategyBasicInfo } from "./DiscountStrategyBasicInfo";
import { DiscountStrategyRules } from "./DiscountStrategyRules";
import { Loader2 } from "lucide-react";

interface DiscountStrategyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingStrategy?: any;
}

export const DiscountStrategyForm = ({ 
  onSuccess, 
  onCancel,
  editingStrategy 
}: DiscountStrategyFormProps) => {
  const form = useForm<DiscountStrategyFormValues>({
    resolver: zodResolver(discountStrategySchema),
    defaultValues: editingStrategy || {
      name: "",
      type: "percentage",
      value: 0,
      min_purchase_amount: 0,
      min_books_count: 0,
      is_stackable: false,
    },
  });

  const onSubmit = async (values: DiscountStrategyFormValues) => {
    const operation = editingStrategy 
      ? supabase.from('discount_strategies').update(values).eq('id', editingStrategy.id)
      : supabase.from('discount_strategies').insert([values]);

    const { error } = await operation;

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Discount strategy ${editingStrategy ? 'updated' : 'created'} successfully`,
    });

    onSuccess();
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2">
          <DiscountStrategyBasicInfo control={form.control} />
          <DiscountStrategyRules 
            control={form.control} 
            discountType={form.watch("type")}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editingStrategy ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingStrategy ? 'Update Strategy' : 'Create Strategy'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};