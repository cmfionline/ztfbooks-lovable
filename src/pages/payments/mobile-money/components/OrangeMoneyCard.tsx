import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const OrangeMoneyCard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveConfig = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const apiKey = formData.get('apiKey') as string;
      const merchantId = formData.get('merchantId') as string;

      const { error } = await supabase
        .from('mobile_money_providers')
        .update({
          config: { 
            api_key: apiKey,
            merchant_id: merchantId
          }
        })
        .eq('provider', 'orange');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Orange Money configuration updated successfully.",
      });

      event.currentTarget.reset();
    } catch (error) {
      console.error('Error saving Orange Money configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update Orange Money configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orange Money Configuration</CardTitle>
        <CardDescription>
          Configure your Orange Money API credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orangeApiKey">API Key</Label>
            <Input
              id="orangeApiKey"
              name="apiKey"
              type="password"
              placeholder="Enter your Orange Money API key"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orangeMerchantId">Merchant ID</Label>
            <Input
              id="orangeMerchantId"
              name="merchantId"
              type="text"
              placeholder="Enter your Orange Money merchant ID"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple hover:bg-purple/90 text-white"
          >
            {isLoading ? "Saving..." : "Save Configuration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};