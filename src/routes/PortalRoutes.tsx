import { Routes, Route } from "react-router-dom";
import PortalLayout from "@/components/portal/PortalLayout";
import PortalHome from "@/pages/portal/Home";
import PortalLibrary from "@/pages/portal/Library";
import PortalProfile from "@/pages/portal/Profile";
import PortalSupport from "@/pages/portal/Support";
import PortalBookDetailPage from "@/pages/portal/books/[id]";

export const PortalRoutes = () => {
  return (
    <Routes>
      <Route element={<PortalLayout />}>
        <Route index element={<PortalHome />} />
        <Route path="library" element={<PortalLibrary />} />
        <Route path="profile" element={<PortalProfile />} />
        <Route path="support" element={<PortalSupport />} />
        <Route path="books/:id" element={<PortalBookDetailPage />} />
      </Route>
    </Routes>
  );
};