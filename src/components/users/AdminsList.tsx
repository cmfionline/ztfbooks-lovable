import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus, Shield, UserCog, DollarSign, Percent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CreateAdminDialog from "./CreateAdminDialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AdminsList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const { data: adminsData, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          sales_agents(
            commission_rate,
            total_sales,
            total_commission
          )
        `)
        .in('role', ['admin', 'super_admin']);
      
      if (profilesError) {
        toast.error("Failed to fetch admin data");
        throw profilesError;
      }
      
      return profiles;
    }
  });

  const updateCommissionRate = async (adminId: string, newRate: number) => {
    const { error } = await supabase
      .from('sales_agents')
      .update({ commission_rate: newRate })
      .eq('user_id', adminId);

    if (error) {
      toast.error("Failed to update commission rate");
      throw error;
    }
    
    toast.success("Commission rate updated successfully");
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administrators</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Sales Performance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminsData?.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.full_name}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <Badge variant={admin.role === 'super_admin' ? 'destructive' : 'default'}>
                  {admin.role}
                </Badge>
              </TableCell>
              <TableCell>{admin.location || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {admin.sales_agents?.[0]?.total_sales || 0}
                </div>
              </TableCell>
              <TableCell>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedAdmin(admin)}
                    >
                      <UserCog className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Admin Details</SheetTitle>
                    </SheetHeader>
                    {selectedAdmin && (
                      <div className="mt-6 space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Sales Agent Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Commission Rate</span>
                              <div className="flex items-center gap-2">
                                <Percent className="w-4 h-4" />
                                {selectedAdmin.sales_agents?.[0]?.commission_rate || 0}%
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Total Sales</span>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                {selectedAdmin.sales_agents?.[0]?.total_sales || 0}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Total Commission</span>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                {selectedAdmin.sales_agents?.[0]?.total_commission || 0}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateAdminDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
};

export default AdminsList;