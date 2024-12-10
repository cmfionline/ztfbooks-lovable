import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Users = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-3xl font-bold mb-8">User Management</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Users Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>User management dashboard coming soon...</p>
                </CardContent>
              </Card>
            </>
          } />
          <Route path="/admins" element={<h1>Admins</h1>} />
          <Route path="/groups" element={<h1>Groups</h1>} />
          <Route path="/permissions" element={<h1>Permissions</h1>} />
          <Route path="/clients" element={<h1>Clients</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Users;