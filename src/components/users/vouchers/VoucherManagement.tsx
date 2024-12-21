import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { VoucherForm } from "./components/VoucherForm";
import { VoucherList } from "./components/VoucherList";
import { DeleteVoucherDialog } from "./components/DeleteVoucherDialog";
import type { Voucher, VoucherType } from "./types";

interface VoucherManagementProps {
  clientId: string;
}

const VoucherManagement = ({ clientId }: VoucherManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  // Create demo vouchers if none exist
  useEffect(() => {
    const createDemoVouchers = async () => {
      const { data: existingVouchers } = await supabase
        .from('vouchers')
        .select('*')
        .eq('client_id', clientId);

      if (!existingVouchers || existingVouchers.length === 0) {
        // Create sample vouchers for each type
        const demoVouchers = [
          {
            code: 'SINGLE123',
            type: 'single_book' as VoucherType,
            client_id: clientId,
            created_by: clientId, // Using clientId as created_by for demo
            number_of_downloads: 1,
            total_amount: 0,
            status: 'active' as const,
            commission_rate: 10
          },
          {
            code: 'MULTI456',
            type: 'multiple_books' as VoucherType,
            client_id: clientId,
            created_by: clientId,
            number_of_downloads: 2,
            total_amount: 0,
            status: 'active' as const,
            commission_rate: 10
          },
          {
            code: 'SERIES789',
            type: 'series' as VoucherType,
            client_id: clientId,
            created_by: clientId,
            number_of_downloads: 3,
            total_amount: 0,
            status: 'active' as const,
            commission_rate: 10
          },
          {
            code: 'TAG101112',
            type: 'book_tag' as VoucherType,
            client_id: clientId,
            created_by: clientId,
            number_of_downloads: 4,
            total_amount: 0,
            status: 'active' as const,
            commission_rate: 10
          }
        ];

        for (const voucher of demoVouchers) {
          const { error } = await supabase
            .from('vouchers')
            .insert(voucher);
          
          if (error) {
            console.error('Error creating demo voucher:', error);
          }
        }

        // Refresh the data
        queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      }
    };

    createDemoVouchers();
  }, [clientId, queryClient]);

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