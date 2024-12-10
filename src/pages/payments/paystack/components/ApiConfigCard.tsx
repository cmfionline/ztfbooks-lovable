import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ApiConfigCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Configure your PayStack API keys
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => {
              window.open('https://dashboard.paystack.com/#/settings/developer', '_blank');
            }}
          >
            Get PayStack API Keys
          </Button>
          <p className="text-sm text-muted-foreground">
            After getting your API keys, add them to your Supabase Edge Function secrets.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};