import { Routes, Route } from "react-router-dom";
import Analytics from "@/pages/Analytics";
import Statistics from "@/pages/Statistics";
import OrdersPage from "@/pages/orders";
import OrderDetailsPage from "@/pages/orders/[id]";
import DevicesPage from "@/pages/orders/devices";
import OrderAnalytics from "@/pages/orders/analytics";
import SupportPage from "@/pages/support";
import NewTicketPage from "@/pages/support/new";
import TicketDetailsPage from "@/pages/support/[id]";
import Books from "@/pages/Books";
import Ads from "@/pages/Ads";
import AdsAnalytics from "@/pages/ads/Analytics";
import DiscountStrategies from "@/pages/ads/DiscountStrategies";
import Pages from "@/pages/Pages";
import Reviews from "@/pages/Reviews";
import Faqs from "@/pages/Faqs";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import ManageHeroSections from "@/pages/portal/hero/ManageHeroSections";
import Payments from "@/pages/Payments";
import Index from "@/pages/Index";
import Vouchers from "@/pages/Vouchers";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="statistics" element={<Statistics />} />
      <Route path="orders">
        <Route index element={<OrdersPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="analytics" element={<OrderAnalytics />} />
        <Route path=":id" element={<OrderDetailsPage />} />
      </Route>
      <Route path="support">
        <Route index element={<SupportPage />} />
        <Route path="new" element={<NewTicketPage />} />
        <Route path=":id" element={<TicketDetailsPage />} />
      </Route>
      <Route path="books/*" element={<Books />} />
      <Route path="ads">
        <Route index element={<Ads />} />
        <Route path="analytics" element={<AdsAnalytics />} />
        <Route path="discount-strategies" element={<DiscountStrategies />} />
      </Route>
      <Route path="pages" element={<Pages />} />
      <Route path="hero" element={<ManageHeroSections />} />
      <Route path="payments/*" element={<Payments />} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="faqs" element={<Faqs />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="settings/*" element={<Settings />} />
      <Route path="vouchers/*" element={<Vouchers />} />
    </Routes>
  );
};