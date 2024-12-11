import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Books from "./pages/Books";
import Ads from "./pages/Ads";
import Analytics from "./pages/ads/Analytics";
import DiscountStrategies from "./pages/ads/DiscountStrategies";
import Payments from "./pages/Payments";
import Statistics from "./pages/Statistics";
import Pages from "./pages/Pages";
import Reviews from "./pages/Reviews";
import Faqs from "./pages/Faqs";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Vouchers from "./pages/Vouchers";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Sidebar />
        <main className="pl-64">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/books/*" element={<Books />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/ads/analytics" element={<Analytics />} />
            <Route path="/ads/discount-strategies" element={<DiscountStrategies />} />
            <Route path="/payments/*" element={<Payments />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/pages" element={<Pages />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users" element={<Users />} />
            <Route path="/vouchers" element={<Vouchers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;