import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import Analytics from "@/pages/Analytics";
import Payments from "@/pages/Payments";
import Statistics from "@/pages/Statistics";
import OrdersPage from "./pages/orders";
import OrderDetailsPage from "./pages/orders/[id]";
import DevicesPage from "./pages/orders/devices";
import OrderAnalytics from "./pages/orders/analytics";

const App = () => {
  return (
    <Router>
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/payments/*" element={<Payments />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/orders/devices" element={<DevicesPage />} />
          <Route path="/orders/analytics" element={<OrderAnalytics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
