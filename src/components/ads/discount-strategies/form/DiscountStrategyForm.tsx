import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { DiscountStrategyBasicInfo } from "./DiscountStrategyBasicInfo";
import { DiscountStrategyRules } from "./DiscountStrategyRules";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { discountStrategySchema, type DiscountStrategyFormValues } from "../schema";
import { addDays } from "date-fns";
import { DiscountDateFields } from "../../form/discount/DiscountDateFields";

interface DiscountStrategyFormProps {
  onSuccess: () => void;
}

export const DiscountStrategyForm = ({ onSuccess }: DiscountStrategyFormProps) => {
  const tomorrow = addDays(new Date(), 1);
  const fiveDaysLater = addDays(tomorrow, 5);

  const form = useForm<DiscountStrategyFormValues>({
    resolver: zodResolver(discountStrategySchema),
    defaultValues: {
      name: "",
      type: "percentage",
      value: 0,
      is_stackable: false,
      start_date: tomorrow.toISOString().split('T')[0],
      end_date: fiveDaysLater.toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: DiscountStrategyFormValues) => {
    try {
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
        description: "The discount strategy has been successfully created.",
      });

      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error creating discount strategy:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="grid gap-6 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <DiscountStrategyBasicInfo control={form.control} />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
              <DiscountDateFields control={form.control} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Discount Rules</h3>
              <DiscountStrategyRules 
                control={form.control} 
                discountType={form.watch('type')}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="min-w-[120px] bg-purple hover:bg-purple/90 text-white focus:ring-2 focus:ring-purple/50"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Strategy'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};