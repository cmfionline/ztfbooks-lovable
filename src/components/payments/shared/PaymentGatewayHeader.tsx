import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PaymentGatewayHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const PaymentGatewayHeader = ({ title, description, icon: Icon }: PaymentGatewayHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <Icon className="h-8 w-8 text-purple" />
        <div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};