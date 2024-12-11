import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const UsersOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['users-stats'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role')
      
      if (error) throw error;
      
      const adminCount = profiles.filter(p => ['admin', 'super_admin'].includes(p.role)).length;
      const clientCount = profiles.filter(p => p.role === 'client').length;
      
      return {
        totalUsers: profiles.length,
        admins: adminCount,
        clients: clientCount
      };
    }
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.admins || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.clients || 0}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UsersOverview;