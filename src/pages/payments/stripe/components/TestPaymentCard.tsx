import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TestPaymentCardProps {
  isActive: boolean;
  isProcessing: boolean;
  onTestPayment: () => void;
}

export const TestPaymentCard = ({ isActive, isProcessing, onTestPayment }: TestPaymentCardProps) => {
  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Test Payment</CardTitle>
        <CardDescription>
          Process a test payment to verify your Stripe integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={onTestPayment}
            disabled={!isActive || isProcessing}
            className="w-full bg-purple hover:bg-purple/90 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Process Test Payment ($10.99)'
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            This will create a test payment session for $10.99 USD
          </p>
        </div>
      </CardContent>
    </Card>
  );
};