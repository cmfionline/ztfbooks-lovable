import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building2, Smartphone, QrCode } from "lucide-react";

const PaymentMethodBadge = ({ 
  icon: Icon, 
  label 
}: { 
  icon: React.ElementType; 
  label: string;
}) => (
  <Badge variant="secondary" className="flex items-center gap-1">
    <Icon className="w-3 h-3" />
    <span>{label}</span>
  </Badge>
);

export const PaymentMethodsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supported Payment Methods</CardTitle>
        <CardDescription>
          Available payment methods through PayStack
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <PaymentMethodBadge icon={CreditCard} label="Credit Cards" />
            <PaymentMethodBadge icon={Building2} label="Bank Transfers" />
            <PaymentMethodBadge icon={Smartphone} label="Mobile Money" />
            <PaymentMethodBadge icon={QrCode} label="USSD" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Key Features:</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
              <li>Local & international cards</li>
              <li>Split payments</li>
              <li>Recurring billing</li>
              <li>Transaction monitoring</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};