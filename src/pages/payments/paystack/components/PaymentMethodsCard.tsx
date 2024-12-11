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
  <Badge variant="secondary" className="flex items-center gap-1 bg-purple-50 text-purple border-purple/20">
    <Icon className="w-3 h-3" />
    <span>{label}</span>
  </Badge>
);

export const PaymentMethodsCard = () => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Supported Payment Methods</CardTitle>
        <CardDescription className="text-sm text-gray-500">
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
            <h3 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h3>
            <ul className="text-sm text-gray-500 list-disc pl-4 space-y-1">
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