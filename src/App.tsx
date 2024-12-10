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
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/books/*" element={<Books />} />
              <Route path="/payments/*" element={<Payments />} />
              <Route path="/users/*" element={<Users />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/pages/*" element={<Pages />} />
              <Route path="/ads" element={<Ads />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/settings/*" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;