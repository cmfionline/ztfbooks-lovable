import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ApiConfigCard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveKeys = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const secretKey = formData.get('secretKey') as string;

      const { error } = await supabase.functions.invoke('update-paystack-keys', {
        body: { secretKey }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "PayStack API keys updated successfully.",
      });

      // Clear the form
      event.currentTarget.reset();
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Failed to update PayStack API keys.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">API Configuration</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Configure your PayStack API keys for payment processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveKeys} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key</Label>
            <Input
              id="secretKey"
              name="secretKey"
              type="password"
              placeholder="sk_test_..."
              required
              className="w-full"
            />
          </div>
          <div className="flex justify-between items-center pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple hover:bg-purple-600 text-white"
            >
              {isLoading ? "Saving..." : "Save API Keys"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                window.open('https://dashboard.paystack.com/#/settings/developer', '_blank');
              }}
              className="border-purple text-purple hover:bg-purple-50"
            >
              Get PayStack API Keys
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};