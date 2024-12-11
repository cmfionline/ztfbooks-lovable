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
import { Check, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VouchersList = () => {
  const navigate = useNavigate();
  
  const { data: vouchers, isLoading } = useQuery({
    queryKey: ['vouchers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          client:profiles(full_name),
          books:voucher_books(
            book:books(title)
          ),
          series:voucher_series(
            series:series(name)
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vouchers</h1>
        <Button onClick={() => navigate('/vouchers/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Voucher
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Client</TableHead>
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
              <TableCell>{voucher.client?.full_name}</TableCell>
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
        </TableBody>
      </Table>
    </div>
  );
};

export default VouchersList;