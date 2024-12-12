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

const PayStackSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  const { data: gateway, isLoading: isLoadingGateway } = useQuery({
    queryKey: ['payment-gateway', 'paystack'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('type', 'paystack')
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
        description: `PayStack payments ${!gateway?.is_active ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating gateway:', error);
      toast({
        title: "Error",
        description: "Failed to update PayStack settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPayment = async () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter a test email address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('paystack-checkout', {
        body: { 
          amount: 10.99,
          email: testEmail,
          currency: 'NGN'
        },
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
        title="PayStack Settings"
        description="Configure your PayStack payment gateway settings"
        icon={CreditCard}
      />
      
      <div className="grid gap-4 md:grid-cols-2">
        <EnableGatewayCard
          title="Enable PayStack Payments"
          description="Accept payments through PayStack"
          isActive={gateway?.is_active || false}
          isLoading={isLoading}
          onToggle={handleToggleActive}
        />
        <PaymentMethodsCard />
        <ApiConfigCard
          title="API Configuration"
          description="Configure your PayStack API keys"
          secretKeyPlaceholder="sk_test_..."
          getApiKeysUrl="https://dashboard.paystack.com/#/settings/developer"
          gatewayType="paystack"
        />
        <TestPaymentCard
          title="Test Payment"
          description="Process a test payment to verify your PayStack integration"
          isActive={gateway?.is_active || false}
          isProcessing={isProcessing}
          testAmount="₦10.99 NGN"
          testEmail={testEmail}
          onEmailChange={setTestEmail}
          onTestPayment={handleTestPayment}
        />
      </div>
    </div>
  );
};

export default PayStackSettings;