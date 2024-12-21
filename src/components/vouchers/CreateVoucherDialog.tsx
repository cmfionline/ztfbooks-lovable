import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VoucherForm } from "./VoucherForm";
import { VoucherErrorBoundary } from "./VoucherErrorBoundary";

interface CreateVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

const CreateVoucherDialog = ({ open, onOpenChange, clientId }: CreateVoucherDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Voucher</DialogTitle>
        </DialogHeader>
        <VoucherErrorBoundary>
          <VoucherForm 
            clientId={clientId} 
            onSuccess={() => onOpenChange(false)} 
          />
        </VoucherErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVoucherDialog;