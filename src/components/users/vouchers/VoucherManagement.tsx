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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, TicketPlus } from "lucide-react";
import CreateVoucherDialog from "./CreateVoucherDialog";

interface VoucherManagementProps {
  clientId: string;
}

const VoucherManagement = ({ clientId }: VoucherManagementProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: vouchers, isLoading } = useQuery({
    queryKey: ['vouchers', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          books:voucher_books(
            book:books(title)
          ),
          series:voucher_series(
            series:series(name)
          )
        `)
        .eq('client_id', clientId);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vouchers</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <TicketPlus className="w-4 h-4 mr-2" />
          Create Voucher
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers?.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell className="font-mono">{voucher.code}</TableCell>
              <TableCell className="capitalize">
                {voucher.type.replace(/_/g, ' ')}
              </TableCell>
              <TableCell>
                {voucher.type === 'single_book' && voucher.books?.[0]?.book?.title}
                {voucher.type === 'series' && voucher.series?.[0]?.series?.name}
                {voucher.type === 'all_books' && 'All Books'}
              </TableCell>
              <TableCell>${voucher.total_amount}</TableCell>
              <TableCell>
                <Badge variant={voucher.redeemed ? "secondary" : "default"}>
                  {voucher.redeemed ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <X className="w-3 h-3 mr-1" />
                  )}
                  {voucher.redeemed ? 'Redeemed' : 'Active'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {vouchers?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No vouchers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateVoucherDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        clientId={clientId}
      />
    </div>
  );
};

export default VoucherManagement;