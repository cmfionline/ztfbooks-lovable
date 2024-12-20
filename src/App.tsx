import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import LoginPage from "@/pages/auth/Login";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { ContentBlockRoutes } from "@/routes/ContentBlockRoutes";
import { PortalRoutes } from "@/routes/PortalRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Portal Routes */}
        <Route path="/portal/*" element={<PortalRoutes />} />

        {/* Admin Routes with nested content blocks */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="content-blocks/*" element={<ContentBlockRoutes />} />
          <Route path="*" element={<AdminRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;