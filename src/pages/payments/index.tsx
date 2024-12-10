import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StripeSettings from "./stripe";

const Payments = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-3xl font-bold mb-8">Payment Gateways</h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Stripe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Accept credit card payments worldwide
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>PayPal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Coming soon...
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>PayStack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Coming soon...
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Mobile Money</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Coming soon...
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          } />
          <Route path="/stripe/*" element={<StripeSettings />} />
          <Route path="/paypal" element={<h1>PayPal Settings (Coming Soon)</h1>} />
          <Route path="/paystack" element={<h1>PayStack Settings (Coming Soon)</h1>} />
          <Route path="/mobile-money" element={<h1>Mobile Money Settings (Coming Soon)</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Payments;