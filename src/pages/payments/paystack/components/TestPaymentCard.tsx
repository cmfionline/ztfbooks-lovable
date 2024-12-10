import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface TestPaymentCardProps {
  isActive: boolean;
  isProcessing: boolean;
  testEmail: string;
  onEmailChange: (email: string) => void;
  onTestPayment: () => void;
}

export const TestPaymentCard = ({
  isActive,
  isProcessing,
  testEmail,
  onEmailChange,
  onTestPayment
}: TestPaymentCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Payment</CardTitle>
        <CardDescription>
          Process a test payment to verify your PayStack integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="testEmail">Test Email</Label>
            <Input
              type="email"
              id="testEmail"
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>
          <Button
            onClick={onTestPayment}
            disabled={!isActive || isProcessing || !testEmail}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Process Test Payment (₦10.99)'
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            This will create a test payment session for ₦10.99
          </p>
        </div>
      </CardContent>
    </Card>
  );
};