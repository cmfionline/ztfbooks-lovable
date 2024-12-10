import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Payments = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-3xl font-bold mb-8">Payment Gateways</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Payment gateways dashboard coming soon...</p>
                </CardContent>
              </Card>
            </>
          } />
          <Route path="/stripe" element={<h1>Stripe Settings</h1>} />
          <Route path="/paystack" element={<h1>Paystack Settings</h1>} />
          <Route path="/flutterwave" element={<h1>Flutterwave Settings</h1>} />
          <Route path="/mobile-money" element={<h1>Mobile Money Settings</h1>} />
          <Route path="/vouchers" element={<h1>Vouchers</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Payments;