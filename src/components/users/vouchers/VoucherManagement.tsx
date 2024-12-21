import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { VoucherForm } from "./components/VoucherForm";
import { VoucherList } from "./components/VoucherList";
import { DeleteVoucherDialog } from "./components/DeleteVoucherDialog";
import type { Voucher } from "./types";

interface VoucherManagementProps {
  clientId: string;
}

const VoucherManagement = ({ clientId }: VoucherManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
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
      return data as Voucher[];
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

  const handleDelete = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedVoucher) {
      deleteVoucherMutation.mutate(selectedVoucher.id);
    }
  };

  const toggleStatus = (voucher: Voucher) => {
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

      <VoucherList 
        vouchers={vouchers || []}
        onToggleStatus={toggleStatus}
        onDelete={handleDelete}
      />

      <DeleteVoucherDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default VoucherManagement;