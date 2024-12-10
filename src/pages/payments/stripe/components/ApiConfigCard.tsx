import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ApiConfigCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Configure your Stripe API keys
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => {
              window.open('https://dashboard.stripe.com/apikeys', '_blank');
            }}
          >
            Get Stripe API Keys
          </Button>
          <p className="text-sm text-muted-foreground">
            After getting your API keys, add them to your Supabase Edge Function secrets.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};