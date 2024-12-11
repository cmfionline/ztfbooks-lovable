import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { discountStrategySchema, type DiscountStrategyFormValues } from "./schema";
import { DiscountStrategyBasicInfo } from "./form/DiscountStrategyBasicInfo";
import { DiscountStrategyRules } from "./form/DiscountStrategyRules";

interface CreateDiscountStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateDiscountStrategyDialog = ({ open, onOpenChange }: CreateDiscountStrategyDialogProps) => {
  const queryClient = useQueryClient();
  
  const form = useForm<DiscountStrategyFormValues>({
    resolver: zodResolver(discountStrategySchema),
    defaultValues: {
      name: "",
      type: "percentage",
      value: 0,
      min_purchase_amount: 0,
      min_books_count: 0,
      is_stackable: false,
    },
  });

  const onSubmit = async (values: DiscountStrategyFormValues) => {
    const { error } = await supabase
      .from('discount_strategies')
      .insert([values]);

    if (error) {
      toast({
        title: "Error creating discount strategy",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Discount strategy created successfully",
    });

    queryClient.invalidateQueries({ queryKey: ['discountStrategies'] });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Discount Strategy</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DiscountStrategyBasicInfo control={form.control} />
            <DiscountStrategyRules control={form.control} discountType={form.watch("type")} />
            <Button type="submit">Create Strategy</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDiscountStrategyDialog;