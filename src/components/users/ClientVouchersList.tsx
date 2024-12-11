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
import { Download, Printer, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface ClientVouchersListProps {
  clientId: string;
}

const ClientVouchersList = ({ clientId }: ClientVouchersListProps) => {
  const { toast } = useToast();

  const { data: vouchers, isLoading } = useQuery({
    queryKey: ['client-vouchers', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          books:voucher_books(
            book:books(
              title
            )
          ),
          series:voucher_series(
            series:series(
              name
            )
          )
        `)
        .eq('client_id', clientId);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching vouchers",
          description: error.message
        });
        throw error;
      }
      return data;
    }
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[200px] mt-4" />;
  }

  const handleDownload = (voucherId: string) => {
    toast({
      title: "Download started",
      description: "Your voucher is being downloaded..."
    });
    // Implement voucher download logic
  };

  const handlePrint = (voucherId: string) => {
    toast({
      title: "Print prepared",
      description: "Your voucher is ready to print..."
    });
    // Implement voucher print logic
  };

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers?.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell className="font-mono">{voucher.code}</TableCell>
              <TableCell className="capitalize">{voucher.type.replace(/_/g, ' ')}</TableCell>
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
              <TableCell>${voucher.total_amount}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(voucher.id)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePrint(voucher.id)}
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {vouchers?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No vouchers found for this client
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientVouchersList;