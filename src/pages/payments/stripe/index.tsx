import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard } from "lucide-react";
import { EnableStripeCard } from "./components/EnableStripeCard";
import { TestPaymentCard } from "./components/TestPaymentCard";
import { ApiConfigCard } from "./components/ApiConfigCard";
import { PaymentMethodsCard } from "./components/PaymentMethodsCard";

const StripeSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: gateway, isLoading: isLoadingGateway } = useQuery({
    queryKey: ['payment-gateway', 'stripe'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('type', 'stripe')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleToggleActive = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('payment_gateways')
        .update({ is_active: !gateway?.is_active })
        .eq('id', gateway?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Stripe payments ${!gateway?.is_active ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating gateway:', error);
      toast({
        title: "Error",
        description: "Failed to update Stripe settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPayment = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { amount: 10.99, currency: 'usd' },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process test payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingGateway) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="w-8 h-8 text-purple" />
        <h1 className="text-2xl font-bold">Stripe Settings</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <EnableStripeCard
          isActive={gateway?.is_active || false}
          isLoading={isLoading}
          onToggle={handleToggleActive}
        />
        <PaymentMethodsCard />
        <ApiConfigCard />
        <TestPaymentCard
          isActive={gateway?.is_active || false}
          isProcessing={isProcessing}
          onTestPayment={handleTestPayment}
        />
      </div>
    </div>
  );
};

export default StripeSettings;