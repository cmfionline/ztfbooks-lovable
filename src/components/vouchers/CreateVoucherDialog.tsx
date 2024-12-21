import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VoucherForm } from "@/components/users/vouchers/components/VoucherForm";
import { VoucherErrorBoundary } from "@/components/users/vouchers/components/VoucherErrorBoundary";

interface CreateVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateVoucherDialog = ({ open, onOpenChange }: CreateVoucherDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Voucher</DialogTitle>
        </DialogHeader>
        <VoucherErrorBoundary>
          <VoucherForm onSuccess={() => onOpenChange(false)} />
        </VoucherErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVoucherDialog;