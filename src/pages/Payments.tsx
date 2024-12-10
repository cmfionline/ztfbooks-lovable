import { Routes, Route } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StripeSettings from "./payments/stripe";
import PayStackSettings from "./payments/paystack";
import FlutterwaveSettings from "./payments/flutterwave";

const PaymentGatewayCard = ({ 
  name, 
  logo, 
  route,
  isActive,
  onToggle 
}: { 
  name: string;
  logo: string;
  route: string;
  isActive: boolean;
  onToggle: () => void;
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-[#1A1F2E] border-0">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="bg-white rounded-lg p-4 w-full h-16 flex items-center justify-center">
            <img src={logo} alt={name} className="h-8 object-contain" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <Switch 
              checked={isActive} 
              onCheckedChange={onToggle}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full bg-[#00B252] hover:bg-[#00B252]/90 text-white border-0"
            onClick={() => navigate(route)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PaymentGateways = () => {
  return (
    <div className="min-h-screen bg-[#0B0F1A] pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-3xl font-bold mb-8 text-white">Payment Gateways</h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <PaymentGatewayCard
                  name="PayPal"
                  logo="/payment-logos/paypal.svg"
                  route="/payments/paypal"
                  isActive={false}
                  onToggle={() => {}}
                />
                <PaymentGatewayCard
                  name="Stripe"
                  logo="/payment-logos/stripe.svg"
                  route="/payments/stripe"
                  isActive={true}
                  onToggle={() => {}}
                />
                <PaymentGatewayCard
                  name="Razorpay"
                  logo="/payment-logos/razorpay.svg"
                  route="/payments/razorpay"
                  isActive={false}
                  onToggle={() => {}}
                />
                <PaymentGatewayCard
                  name="PayStack"
                  logo="/payment-logos/paystack.svg"
                  route="/payments/paystack"
                  isActive={true}
                  onToggle={() => {}}
                />
                <PaymentGatewayCard
                  name="PayUMoney"
                  logo="/payment-logos/payumoney.svg"
                  route="/payments/payumoney"
                  isActive={false}
                  onToggle={() => {}}
                />
                <PaymentGatewayCard
                  name="Flutterwave"
                  logo="/payment-logos/flutterwave.svg"
                  route="/payments/flutterwave"
                  isActive={true}
                  onToggle={() => {}}
                />
                <PaymentGatewayCard
                  name="CinetPay"
                  logo="/payment-logos/cinetpay.svg"
                  route="/payments/cinetpay"
                  isActive={false}
                  onToggle={() => {}}
                />
                <PaymentGatewayCard
                  name="Bank Transfer"
                  logo="/payment-logos/bank-transfer.svg"
                  route="/payments/bank-transfer"
                  isActive={false}
                  onToggle={() => {}}
                />
                <PaymentGatewayCard
                  name="SSLCOMMERZ"
                  logo="/payment-logos/sslcommerz.svg"
                  route="/payments/sslcommerz"
                  isActive={false}
                  onToggle={() => {}}
                />
              </div>
            </>
          } />
          <Route path="/stripe/*" element={<StripeSettings />} />
          <Route path="/paystack/*" element={<PayStackSettings />} />
          <Route path="/flutterwave/*" element={<FlutterwaveSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default PaymentGateways;