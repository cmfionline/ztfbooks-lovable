import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import LoginPage from "@/pages/auth/Login";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { ContentBlockRoutes } from "@/routes/ContentBlockRoutes";
import { PortalRoutes } from "@/routes/PortalRoutes";

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
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Portal Routes */}
        <PortalRoutes />

        {/* Admin Routes */}
        <Route path="/" element={<AdminLayout />}>
          {/* Content Blocks Routes - Must be first to prevent index route from catching */}
          <ContentBlockRoutes />
          
          {/* Other Admin Routes */}
          <AdminRoutes />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
