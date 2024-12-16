import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import PortalLayout from "@/components/portal/PortalLayout";
import PortalHome from "@/pages/portal/Home";
import PortalLibrary from "@/pages/portal/Library";
import PortalProfile from "@/pages/portal/Profile";
import PortalSupport from "@/pages/portal/Support";
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
import Pages from "./pages/Pages";
import AddPage from "./components/pages/AddPage";
import EditPage from "./components/pages/EditPage";
import Reviews from "./pages/Reviews";
import Faqs from "./pages/Faqs";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Portal Routes */}
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalHome />} />
          <Route path="library" element={<PortalLibrary />} />
          <Route path="profile" element={<PortalProfile />} />
          <Route path="support" element={<PortalSupport />} />
        </Route>

        {/* Admin Routes */}
        <Route 
          path="/" 
          element={
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex-1 ml-64">
                <Routes>
                  <Route path="/" element={<Analytics />} />
                  <Route path="/payments/*" element={<Payments />} />
                  <Route path="/statistics" element={<Statistics />} />
                  
                  {/* Orders Routes */}
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrderDetailsPage />} />
                  <Route path="/orders/devices" element={<DevicesPage />} />
                  <Route path="/orders/analytics" element={<OrderAnalytics />} />
                  
                  {/* Support Routes */}
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/support/new" element={<NewTicketPage />} />
                  <Route path="/support/:id" element={<TicketDetailsPage />} />
                  
                  {/* Books Routes - Using the wildcard to handle nested routes */}
                  <Route path="/books/*" element={<Books />} />
                  
                  {/* Ads Routes */}
                  <Route path="/ads" element={<Ads />} />
                  <Route path="/ads/analytics" element={<AdsAnalytics />} />
                  <Route path="/ads/discount-strategies" element={<DiscountStrategies />} />
                  
                  {/* Pages Routes */}
                  <Route path="/pages" element={<Pages />} />
                  <Route path="/pages/add" element={<AddPage />} />
                  <Route path="/pages/:id/edit" element={<EditPage />} />
                  
                  {/* Other Routes */}
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/faqs" element={<Faqs />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
