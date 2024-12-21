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
import { Check, X } from "lucide-react";
import { VoucherForm } from "@/components/vouchers/VoucherForm";
import { useState } from "react";

interface VoucherManagementProps {
  clientId: string;
}

const VoucherManagement = ({ clientId }: VoucherManagementProps) => {
  const [showForm, setShowForm] = useState(false);

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
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Voucher'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-background p-4 rounded-lg border mb-4">
          <VoucherForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Downloads</TableHead>
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
              <TableCell>{voucher.number_of_downloads}</TableCell>
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
    </div>
  );
};

export default VoucherManagement;