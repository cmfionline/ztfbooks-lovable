import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface TestPaymentCardProps {
  title: string;
  description: string;
  isActive: boolean;
  isProcessing: boolean;
  testAmount: string;
  testEmail?: string;
  onEmailChange?: (email: string) => void;
  onTestPayment: () => void;
}

export const TestPaymentCard = ({
  title,
  description,
  isActive,
  isProcessing,
  testAmount,
  testEmail,
  onEmailChange,
  onTestPayment
}: TestPaymentCardProps) => {
  return (
    <Card className="bg-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {onEmailChange && (
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
          )}
          <Button
            onClick={onTestPayment}
            disabled={!isActive || isProcessing || (onEmailChange && !testEmail)}
            className="w-full bg-purple hover:bg-purple/90 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Process Test Payment (${testAmount})`
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            This will create a test payment session for {testAmount}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};