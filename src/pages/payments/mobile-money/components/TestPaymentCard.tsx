import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TestPaymentCardProps {
  isActive: boolean;
  isProcessing: boolean;
  onTestPayment: () => void;
}

export const TestPaymentCard = ({
  isActive,
  isProcessing,
  onTestPayment,
}: TestPaymentCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Payment</CardTitle>
        <CardDescription>
          Process a test payment to verify your configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onTestPayment}
          disabled={!isActive || isProcessing}
          className="w-full bg-purple hover:bg-purple/90 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Test Mobile Money Payment'
          )}
        </Button>
        {!isActive && (
          <p className="mt-2 text-sm text-muted-foreground">
            Enable Mobile Money payments to test the integration
          </p>
        )}
      </CardContent>
    </Card>
  );
};