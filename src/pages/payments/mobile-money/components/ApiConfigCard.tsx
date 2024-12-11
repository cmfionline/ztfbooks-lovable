import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ApiConfigCardProps {
  gatewayId?: string;
}

export const ApiConfigCard = ({ gatewayId }: ApiConfigCardProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveKeys = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!gatewayId) {
      toast({
        title: "Error",
        description: "Gateway configuration not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const apiKey = formData.get('apiKey') as string;
      const merchantId = formData.get('merchantId') as string;

      const { error } = await supabase
        .from('payment_gateways')
        .update({
          config: { 
            api_key: apiKey,
            merchant_id: merchantId
          }
        })
        .eq('id', gatewayId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mobile Money API configuration updated successfully.",
      });

      // Clear the form
      event.currentTarget.reset();
    } catch (error) {
      console.error('Error saving API configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update Mobile Money API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Configure your Mobile Money API credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveKeys} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              name="apiKey"
              type="password"
              placeholder="Enter your API key"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="merchantId">Merchant ID</Label>
            <Input
              id="merchantId"
              name="merchantId"
              type="text"
              placeholder="Enter your merchant ID"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !gatewayId}
          >
            {isLoading ? "Saving..." : "Save Configuration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};