import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const MtnMomoCard = () => {
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
        .eq('provider', 'mtn');

      if (error) throw error;

      toast({
        title: "Success",
        description: "MTN MoMo configuration updated successfully.",
      });

      event.currentTarget.reset();
    } catch (error) {
      console.error('Error saving MTN MoMo configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update MTN MoMo configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>MTN Mobile Money Configuration</CardTitle>
        <CardDescription>
          Configure your MTN MoMo API credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mtnApiKey">API Key</Label>
            <Input
              id="mtnApiKey"
              name="apiKey"
              type="password"
              placeholder="Enter your MTN MoMo API key"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mtnMerchantId">Merchant ID</Label>
            <Input
              id="mtnMerchantId"
              name="merchantId"
              type="text"
              placeholder="Enter your MTN MoMo merchant ID"
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