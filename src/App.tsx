import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Books from "./pages/Books";
import Payments from "./pages/Payments";
import Users from "./pages/Users";
import Statistics from "./pages/Statistics";
import Pages from "./pages/Pages";
import Ads from "./pages/Ads";
import Reviews from "./pages/Reviews";
import Faqs from "./pages/Faqs";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navigation />
        {children}
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Index />
            </Layout>
          } />
          <Route path="/books/*" element={
            <Layout>
              <Books />
            </Layout>
          } />
          <Route path="/payments/*" element={
            <Layout>
              <Payments />
            </Layout>
          } />
          <Route path="/users/*" element={
            <Layout>
              <Users />
            </Layout>
          } />
          <Route path="/statistics" element={
            <Layout>
              <Statistics />
            </Layout>
          } />
          <Route path="/pages/*" element={
            <Layout>
              <Pages />
            </Layout>
          } />
          <Route path="/ads" element={
            <Layout>
              <Ads />
            </Layout>
          } />
          <Route path="/reviews" element={
            <Layout>
              <Reviews />
            </Layout>
          } />
          <Route path="/faqs" element={
            <Layout>
              <Faqs />
            </Layout>
          } />
          <Route path="/settings/*" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          <Route path="/notifications" element={
            <Layout>
              <Notifications />
            </Layout>
          } />
          <Route path="/subscription-plans" element={
            <Layout>
              <SubscriptionPlans />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;