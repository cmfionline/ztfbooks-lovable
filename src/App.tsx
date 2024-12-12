import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Analytics from "@/pages/Analytics";
import Payments from "@/pages/Payments";
import Statistics from "@/pages/Statistics";
import OrdersPage from "./pages/orders";
import OrderDetailsPage from "./pages/orders/[id]";
import DevicesPage from "./pages/orders/devices";
import OrderAnalytics from "./pages/orders/analytics";
import SupportPage from "./pages/support";
import NewTicketPage from "./pages/support/new";
import TicketDetailsPage from "./pages/support/[id]";
import Books from "./pages/Books";
import Ads from "./pages/Ads";
import AdsAnalytics from "./pages/ads/Analytics";
import DiscountStrategies from "./pages/ads/DiscountStrategies";

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Analytics />} />
            <Route path="/payments/*" element={<Payments />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/orders/devices" element={<DevicesPage />} />
            <Route path="/orders/analytics" element={<OrderAnalytics />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support/new" element={<NewTicketPage />} />
            <Route path="/support/:id" element={<TicketDetailsPage />} />
            <Route path="/books/*" element={<Books />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/ads/analytics" element={<AdsAnalytics />} />
            <Route path="/ads/discount-strategies" element={<DiscountStrategies />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;