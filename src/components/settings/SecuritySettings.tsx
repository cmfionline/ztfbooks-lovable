import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const SecuritySettings = () => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [adminActions, setAdminActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: loginData, error: loginError } = await supabase
          .from('login_history')
          .select('*')
          .eq('user_id', user.id)
          .order('login_timestamp', { ascending: false })
          .limit(10);

        if (loginError) throw loginError;
        setLoginHistory(loginData || []);

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile && ['admin', 'super_admin'].includes(profile.role)) {
          const { data: actions, error: actionsError } = await supabase
            .from('admin_actions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

          if (actionsError) throw actionsError;
          setAdminActions(actions || []);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load security data. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchSecurityData();
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>Recent login attempts to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginHistory.map((login) => (
                  <TableRow key={login.id}>
                    <TableCell>
                      {format(new Date(login.login_timestamp), 'PPpp')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        login.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {login.success ? 'Success' : 'Failed'}
                      </span>
                    </TableCell>
                    <TableCell>{login.location || 'Unknown'}</TableCell>
                    <TableCell>{login.ip_address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {adminActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Action Audit Trail</CardTitle>
            <CardDescription>Recent administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminActions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        {format(new Date(action.created_at), 'PPpp')}
                      </TableCell>
                      <TableCell>{action.action_type}</TableCell>
                      <TableCell>{action.entity_type}</TableCell>
                      <TableCell>{action.admin_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};