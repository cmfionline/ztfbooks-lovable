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
import { Check, X, Plus, Download, Printer } from "lucide-react";
import { useState } from "react";
import CreateVoucherDialog from "./CreateVoucherDialog";
import { Filters } from "@/components/dashboard/Filters";
import { toast } from "sonner";

const VouchersList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: vouchers, isLoading } = useQuery({
    queryKey: ['vouchers', searchQuery],
    queryFn: async () => {
      let query = supabase
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

      if (searchQuery) {
        query = query.ilike('code', `%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast.error("Error loading vouchers: " + error.message);
        throw error;
      }
      return data;
    }
  });

  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Exporting vouchers as ${format.toUpperCase()}`);
    // Implement export logic here
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vouchers</h1>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-purple hover:bg-purple/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Voucher
        </Button>
      </div>

      <Filters 
        onSearch={setSearchQuery}
        onExport={handleExport}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
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
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast.success("Downloading voucher...");
                  }}
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast.success("Preparing voucher for printing...");
                  }}
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {(!vouchers || vouchers.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No vouchers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateVoucherDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default VouchersList;