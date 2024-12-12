import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Key } from "lucide-react";

interface ApiConfigCardProps {
  title: string;
  description: string;
  secretKeyPlaceholder: string;
  getApiKeysUrl: string;
  gatewayType: string;
}

export const ApiConfigCard = ({ 
  title, 
  description, 
  secretKeyPlaceholder,
  getApiKeysUrl,
  gatewayType
}: ApiConfigCardProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveKeys = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const secretKey = formData.get('secretKey') as string;

      const { error } = await supabase
        .from('payment_gateways')
        .update({
          config: { secret_key: secretKey }
        })
        .eq('type', gatewayType);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API keys updated successfully.",
      });

      event.currentTarget.reset();
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Failed to update API keys.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-background">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-purple" />
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
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
              placeholder={secretKeyPlaceholder}
              className="bg-input border-input"
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
                window.open(getApiKeysUrl, '_blank');
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