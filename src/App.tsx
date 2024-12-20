import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import PortalLayout from "@/components/portal/PortalLayout";
import PortalHome from "@/pages/portal/Home";
import PortalLibrary from "@/pages/portal/Library";
import PortalProfile from "@/pages/portal/Profile";
import PortalSupport from "@/pages/portal/Support";
import PortalBookDetailPage from "@/pages/portal/books/[id]";
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
import ManageHeroSections from "@/pages/portal/hero/ManageHeroSections";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navigation />
        <main className="p-8 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

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
          <Route path="books/:id" element={<PortalBookDetailPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/" element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<Analytics />} />
          <Route path="statistics" element={<Statistics />} />
          
          {/* Orders Routes - Specific routes first */}
          <Route path="orders/devices" element={<DevicesPage />} />
          <Route path="orders/analytics" element={<OrderAnalytics />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          
          {/* Support Routes - Specific routes first */}
          <Route path="support/new" element={<NewTicketPage />} />
          <Route path="support/:id" element={<TicketDetailsPage />} />
          <Route path="support" element={<SupportPage />} />
          
          {/* Books Routes */}
          <Route path="books/*" element={<Books />} />
          
          {/* Ads Routes */}
          <Route path="ads/analytics" element={<AdsAnalytics />} />
          <Route path="ads/discount-strategies" element={<DiscountStrategies />} />
          <Route path="ads" element={<Ads />} />
          
          {/* Pages Routes - Specific routes first */}
          <Route path="pages/add" element={<AddPage />} />
          <Route path="pages/:id/edit" element={<EditPage />} />
          <Route path="pages" element={<Pages />} />
          <Route path="hero" element={<ManageHeroSections />} />
          
          {/* Payment Routes */}
          <Route path="payments/*" element={<Payments />} />
          
          {/* Other Routes */}
          <Route path="reviews" element={<Reviews />} />
          <Route path="faqs" element={<Faqs />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
