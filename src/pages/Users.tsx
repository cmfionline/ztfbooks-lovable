import { Routes, Route } from "react-router-dom";
import { Card } from "@/components/ui/card";
import UsersOverview from "@/components/users/UsersOverview";
import AdminsList from "@/components/users/AdminsList";
import GroupsList from "@/components/users/GroupsList";
import PermissionsList from "@/components/users/PermissionsList";
import ClientsList from "@/components/users/ClientsList";

const Users = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<UsersOverview />} />
          <Route path="/admins" element={<AdminsList />} />
          <Route path="/groups" element={<GroupsList />} />
          <Route path="/permissions" element={<PermissionsList />} />
          <Route path="/clients" element={<ClientsList />} />
        </Routes>
      </div>
    </div>
  );
};

export default Users;