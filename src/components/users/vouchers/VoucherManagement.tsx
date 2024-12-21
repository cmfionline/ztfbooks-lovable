import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Check, X, Edit, Trash2, Ban } from "lucide-react";
import { VoucherForm } from "./components/VoucherForm";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VoucherManagementProps {
  clientId: string;
}

const VoucherManagement = ({ clientId }: VoucherManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

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
          ),
          tags:voucher_tags(
            tag:tags(name)
          )
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteVoucherMutation = useMutation({
    mutationFn: async (voucherId: string) => {
      const { error } = await supabase
        .from('vouchers')
        .delete()
        .eq('id', voucherId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Voucher deleted successfully');
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error('Error deleting voucher: ' + error.message);
    }
  });

  const toggleVoucherStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('vouchers')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Voucher status updated successfully');
    },
    onError: (error) => {
      toast.error('Error updating voucher status: ' + error.message);
    }
  });

  const handleDelete = (voucher: any) => {
    setSelectedVoucher(voucher);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedVoucher) {
      deleteVoucherMutation.mutate(selectedVoucher.id);
    }
  };

  const toggleStatus = (voucher: any) => {
    const newStatus = voucher.status === 'active' ? 'inactive' : 'active';
    toggleVoucherStatusMutation.mutate({ id: voucher.id, status: newStatus });
  };

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
        <div className="bg-background rounded-lg border p-4 mb-4">
          <VoucherForm clientId={clientId} onSuccess={() => setShowForm(false)} />
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
            <TableHead>Actions</TableHead>
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
                {voucher.type === 'book_tag' && voucher.tags?.[0]?.tag?.name}
                {voucher.type === 'all_books' && 'All Books'}
              </TableCell>
              <TableCell>{voucher.number_of_downloads}</TableCell>
              <TableCell>
                <Badge 
                  variant={voucher.status === 'active' ? "default" : "secondary"}
                  className="capitalize"
                >
                  {voucher.status === 'active' ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <X className="w-3 h-3 mr-1" />
                  )}
                  {voucher.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStatus(voucher)}
                    title={voucher.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(voucher)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {vouchers?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No vouchers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the voucher
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VoucherManagement;