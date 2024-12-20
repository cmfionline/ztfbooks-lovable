import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import LoginPage from "@/pages/auth/Login";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { PortalRoutes } from "@/routes/PortalRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Portal Routes */}
        <Route path="/portal/*" element={<PortalRoutes />} />

        {/* Admin Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="*" element={<AdminRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;