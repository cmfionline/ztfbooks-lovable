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
import { User, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ClientVouchersList from "./ClientVouchersList";
import { useToast } from "@/components/ui/use-toast";

const ClientsList = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      // First, fetch all clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client');
      
      if (clientsError) {
        toast({
          variant: "destructive",
          title: "Error fetching clients",
          description: clientsError.message
        });
        throw clientsError;
      }

      // Then, for each client, fetch their voucher count
      const clientsWithVoucherCount = await Promise.all(
        clientsData.map(async (client) => {
          const { count, error: vouchersError } = await supabase
            .from('vouchers')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', client.id);
          
          if (vouchersError) {
            console.error('Error fetching voucher count:', vouchersError);
            return { ...client, voucherCount: 0 };
          }

          return { ...client, voucherCount: count || 0 };
        })
      );

      return clientsWithVoucherCount;
    }
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Vouchers</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {client.full_name}
              </TableCell>
              <TableCell>{client.location || 'N/A'}</TableCell>
              <TableCell>
                {new Date(client.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {client.voucherCount} vouchers
              </TableCell>
              <TableCell>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedClientId(client.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Vouchers
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Vouchers for {client.full_name}</SheetTitle>
                    </SheetHeader>
                    {selectedClientId && (
                      <ClientVouchersList clientId={selectedClientId} />
                    )}
                  </SheetContent>
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsList;