import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Key } from "lucide-react";

export const ApiConfigCard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveKeys = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const secretKey = formData.get('secretKey') as string;

      const { error } = await supabase.functions.invoke('update-stripe-keys', {
        body: { secretKey }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stripe API keys updated successfully.",
      });

      // Clear the form
      event.currentTarget.reset();
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Failed to update Stripe API keys.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-purple" />
          <div>
            <CardTitle className="text-lg">API Configuration</CardTitle>
            <CardDescription className="text-sm">
              Configure your Stripe API keys
            </CardDescription>
          </div>
        </div>
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
              className="bg-gray-50 border-gray-200"
              required
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple hover:bg-purple/90 text-white"
            >
              {isLoading ? "Saving..." : "Save API Keys"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-purple text-purple hover:bg-purple/10"
              onClick={() => {
                window.open('https://dashboard.stripe.com/apikeys', '_blank');
              }}
            >
              Get API Keys
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};