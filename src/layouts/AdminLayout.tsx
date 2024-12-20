import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";

export const AdminLayout = () => {
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