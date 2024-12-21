import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Download, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VoucherBatchActionsProps {
  selectedVouchers: string[];
  onComplete: () => void;
}

export const VoucherBatchActions = ({ selectedVouchers, onComplete }: VoucherBatchActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBatchDelete = async () => {
    if (!selectedVouchers.length) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('vouchers')
        .delete()
        .in('id', selectedVouchers);

      if (error) throw error;
      
      toast.success(`Successfully deleted ${selectedVouchers.length} vouchers`);
      onComplete();
    } catch (error) {
      toast.error("Failed to delete vouchers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchDownload = () => {
    toast.success("Preparing vouchers for download...");
    // Implement download logic
  };

  const handleBatchPrint = () => {
    toast.success("Preparing vouchers for printing...");
    // Implement print logic
  };

  if (!selectedVouchers.length) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">
        {selectedVouchers.length} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBatchDownload}
        disabled={isLoading}
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBatchPrint}
        disabled={isLoading}
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleBatchDelete}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4 mr-2" />
        )}
        Delete
      </Button>
    </div>
  );
};