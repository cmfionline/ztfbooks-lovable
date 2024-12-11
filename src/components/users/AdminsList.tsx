import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CreateAdminDialog from "./CreateAdminDialog";
import { AdminTableHeader } from "./components/AdminTableHeader";
import { AdminTableRow } from "./components/AdminTableRow";
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
          sales_agents (
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

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Administrators</h1>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Admin
          </Button>
        </div>
      </div>

      <Table>
        <AdminTableHeader />
        <TableBody>
          {adminsData?.map((admin) => (
            <AdminTableRow
              key={admin.id}
              admin={admin}
              selectedAdmin={selectedAdmin}
              onSelectAdmin={setSelectedAdmin}
            />
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