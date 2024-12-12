import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Smartphone } from "lucide-react";
import { EnableMobileMoneyCard } from "./components/EnableMobileMoneyCard";
import { TestPaymentCard } from "./components/TestPaymentCard";
import { MtnMomoCard } from "./components/MtnMomoCard";
import { OrangeMoneyCard } from "./components/OrangeMoneyCard";
import { PaymentMethodsCard } from "./components/PaymentMethodsCard";

const MobileMoneySettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: gateway, isLoading: isLoadingGateway } = useQuery({
    queryKey: ['payment-gateway', 'mobile_money'],
    queryFn: async () => {
      try {
        console.log('Fetching Mobile Money gateway...');
        const { data, error } = await supabase
          .from('payment_gateways')
          .select('*')
          .eq('type', 'mobile_money')
          .maybeSingle();
        
        if (error) throw error;
        
        if (!data) {
          console.log('No gateway found, creating new one...');
          const { data: newGateway, error: createError } = await supabase
            .from('payment_gateways')
            .insert({
              name: 'Mobile Money',
              type: 'mobile_money',
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
          description: "Failed to initialize Mobile Money gateway configuration.",
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

      await queryClient.invalidateQueries({ queryKey: ['payment-gateway', 'mobile_money'] });

      toast({
        title: "Success",
        description: `Mobile Money payments ${!gateway.is_active ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating gateway:', error);
      toast({
        title: "Error",
        description: "Failed to update Mobile Money settings.",
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
        description: "Please enable Mobile Money payments first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('mobile-money-checkout', {
        body: { amount: 10.99, currency: 'XAF' },
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
        <Smartphone className="w-8 h-8 text-purple" />
        <h1 className="text-2xl font-bold">Mobile Money Settings</h1>
      </div>
      
      <div className="grid gap-6">
        <EnableMobileMoneyCard
          isActive={gateway?.is_active || false}
          isLoading={isLoading}
          onToggle={handleToggleActive}
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          <MtnMomoCard />
          <OrangeMoneyCard />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PaymentMethodsCard />
          <TestPaymentCard
            isActive={gateway?.is_active || false}
            isProcessing={isProcessing}
            onTestPayment={handleTestPayment}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMoneySettings;