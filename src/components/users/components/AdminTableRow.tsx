import { Shield, UserCog, DollarSign, Percent } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminTableRowProps {
  admin: any;
  onSelectAdmin: (admin: any) => void;
  selectedAdmin: any;
}

export const AdminTableRow = ({ admin, onSelectAdmin, selectedAdmin }: AdminTableRowProps) => {
  return (
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
              onClick={() => onSelectAdmin(admin)}
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
  );
};