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

      const { error } = await supabase.functions.invoke('update-flutterwave-keys', {
        body: { secretKey }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Flutterwave API keys updated successfully.",
      });

      // Clear the form
      event.currentTarget.reset();
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Failed to update Flutterwave API keys.",
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
          Configure your Flutterwave API keys for payment processing
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
              placeholder="FLWSECK_TEST-..."
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save API Keys"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                window.open('https://app.flutterwave.com/dashboard/settings/apis', '_blank');
              }}
            >
              Get Flutterwave API Keys
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};