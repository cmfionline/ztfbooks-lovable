import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";

export const PaymentMethodsCard = () => {
  const supportedMethods = [
    { name: "MTN Mobile Money", icon: Phone },
    { name: "Orange Money", icon: Phone },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Supported mobile money payment methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {supportedMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.name}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span>{method.name}</span>
                </div>
                <Badge variant="secondary">Supported</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};