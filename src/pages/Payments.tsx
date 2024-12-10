import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Bank,
  QrCode,
} from "lucide-react";
import StripeSettings from "./payments/stripe";
import PayStackSettings from "./payments/paystack";

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

const Payments = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-3xl font-bold mb-8">Payment Gateways</h1>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Stripe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Accept credit card payments worldwide
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Payment Methods:</h3>
                        <div className="flex flex-wrap gap-2">
                          <PaymentMethodBadge icon={CreditCard} label="Credit Cards" />
                          <PaymentMethodBadge icon={Bank} label="Bank Transfers" />
                          <PaymentMethodBadge icon={Wallet} label="Digital Wallets" />
                          <PaymentMethodBadge icon={Building2} label="SEPA Direct Debit" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Key Features:</h3>
                        <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                          <li>150+ currencies supported</li>
                          <li>Advanced fraud protection</li>
                          <li>Subscription billing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>PayStack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Accept payments in Nigeria and other African countries
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Payment Methods:</h3>
                        <div className="flex flex-wrap gap-2">
                          <PaymentMethodBadge icon={CreditCard} label="Credit Cards" />
                          <PaymentMethodBadge icon={Bank} label="Bank Transfers" />
                          <PaymentMethodBadge icon={Smartphone} label="Mobile Money" />
                          <PaymentMethodBadge icon={QrCode} label="USSD" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Key Features:</h3>
                        <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                          <li>Local & international cards</li>
                          <li>Split payments</li>
                          <li>Recurring billing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          } />
          <Route path="/stripe/*" element={<StripeSettings />} />
          <Route path="/paystack/*" element={<PayStackSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Payments;