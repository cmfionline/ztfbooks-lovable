import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard } from "lucide-react";
import { EnableFlutterwaveCard } from "./components/EnableFlutterwaveCard";
import { TestPaymentCard } from "./components/TestPaymentCard";
import { ApiConfigCard } from "./components/ApiConfigCard";
import { PaymentMethodsCard } from "./components/PaymentMethodsCard";

const FlutterwaveSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: gateway, isLoading: isLoadingGateway } = useQuery({
    queryKey: ['payment-gateway', 'flutterwave'],
    queryFn: async () => {
      try {
        console.log('Fetching Flutterwave gateway...');
        const { data, error } = await supabase
          .from('payment_gateways')
          .select('*')
          .eq('type', 'flutterwave')
          .maybeSingle();
        
        if (error) throw error;
        
        if (!data) {
          console.log('No gateway found, creating new one...');
          const { data: newGateway, error: createError } = await supabase
            .from('payment_gateways')
            .insert({
              name: 'Flutterwave',
              type: 'flutterwave',
              is_active: false,
              config: {}
            })
            .select()
            .single();

          if (createError) throw createError;
          return newGateway;
        }

        return data;
      } catch (error) {
        console.error('Error in gateway query:', error);
        toast({
          title: "Error",
          description: "Failed to initialize Flutterwave gateway configuration.",
          variant: "destructive",
        });
        return null;
      }
    }
  });

  const handleToggleActive = async () => {
    if (!gateway?.id) {
      toast({
        title: "Error",
        description: "Gateway configuration not found.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('payment_gateways')
        .update({ is_active: !gateway.is_active })
        .eq('id', gateway.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['payment-gateway', 'flutterwave'] });

      toast({
        title: "Success",
        description: `Flutterwave payments ${!gateway.is_active ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating gateway:', error);
      toast({
        title: "Error",
        description: "Failed to update Flutterwave settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPayment = async () => {
    if (!gateway?.is_active) {
      toast({
        title: "Error",
        description: "Please enable Flutterwave payments first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('flutterwave-checkout', {
        body: { amount: 10.99, currency: 'NGN' },
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
        <h1 className="text-2xl font-bold">Flutterwave Settings</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <EnableFlutterwaveCard
          isActive={gateway?.is_active || false}
          isLoading={isLoading}
          onToggle={handleToggleActive}
        />
        <PaymentMethodsCard />
        <ApiConfigCard gatewayId={gateway?.id} />
        <TestPaymentCard
          isActive={gateway?.is_active || false}
          isProcessing={isProcessing}
          onTestPayment={handleTestPayment}
        />
      </div>
    </div>
  );
};

export default FlutterwaveSettings;