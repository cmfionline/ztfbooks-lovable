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
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Test Payment</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Process a test payment to verify your PayStack integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testEmail">Test Email</Label>
            <Input
              type="email"
              id="testEmail"
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={onTestPayment}
            disabled={!isActive || isProcessing || !testEmail}
            className="w-full bg-purple hover:bg-purple-600 text-white"
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
          <p className="text-sm text-gray-500 mt-2">
            This will create a test payment session for ₦10.99
          </p>
        </div>
      </CardContent>
    </Card>
  );
};