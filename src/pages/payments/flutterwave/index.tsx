import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";
import { PaymentGatewayHeader } from "@/components/payments/shared/PaymentGatewayHeader";
import { EnableGatewayCard } from "@/components/payments/shared/EnableGatewayCard";
import { ApiConfigCard } from "@/components/payments/shared/ApiConfigCard";
import { TestPaymentCard } from "@/components/payments/shared/TestPaymentCard";
import { PaymentMethodsCard } from "./components/PaymentMethodsCard";

const FlutterwaveSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: gateway, isLoading: isLoadingGateway } = useQuery({
    queryKey: ['payment-gateway', 'flutterwave'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('payment_gateways')
          .select('*')
          .eq('type', 'flutterwave')
          .maybeSingle();
        
        if (error) throw error;
        
        if (!data) {
          const { data: newGateway, error: createError } = await supabase
            .from('payment_gateways')
            .insert([{
              name: 'Flutterwave',
              type: 'flutterwave',
              is_active: false,
              config: {}
            }])
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
    return null;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PaymentGatewayHeader
        title="Flutterwave Settings"
        description="Configure your Flutterwave payment gateway settings"
        icon={CreditCard}
      />
      
      <div className="grid gap-4 md:grid-cols-2">
        <EnableGatewayCard
          title="Enable Flutterwave Payments"
          description="Accept payments through Flutterwave"
          isActive={gateway?.is_active || false}
          isLoading={isLoading}
          onToggle={handleToggleActive}
        />
        <PaymentMethodsCard />
        <ApiConfigCard
          title="API Configuration"
          description="Configure your Flutterwave API keys"
          secretKeyPlaceholder="FLWSECK_TEST-..."
          getApiKeysUrl="https://app.flutterwave.com/dashboard/settings/apis"
          gatewayType="flutterwave"
        />
        <TestPaymentCard
          title="Test Payment"
          description="Process a test payment to verify your Flutterwave integration"
          isActive={gateway?.is_active || false}
          isProcessing={isProcessing}
          testAmount="₦10.99 NGN"
          onTestPayment={handleTestPayment}
        />
      </div>
    </div>
  );
};

export default FlutterwaveSettings;