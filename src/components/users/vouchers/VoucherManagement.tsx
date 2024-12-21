import { useState } from "react";
import { useVoucherData } from "./hooks/useVoucherData";
import { VoucherList } from "./components/VoucherList";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { trackVoucherError, trackVoucherPerformance, measureVoucherMetrics } from "./monitoring/VoucherMetrics";
import { VoucherErrorBoundary } from "./components/VoucherErrorBoundary";

interface VoucherManagementProps {
  clientId: string;
}

const ITEMS_PER_PAGE = 10;

const VoucherManagement = ({ clientId }: VoucherManagementProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const startTime = performance.now();
  const { data, isLoading, error } = useVoucherData(clientId, currentPage);
  
  // Track performance
  if (data) {
    trackVoucherPerformance('data-fetch', startTime);
    const metrics = measureVoucherMetrics(data.vouchers);
    console.log('Voucher Metrics:', metrics);
  }

  // Track errors
  if (error) {
    trackVoucherError(error as Error, { clientId, currentPage });
    toast({
      variant: "destructive",
      title: "Error loading vouchers",
      description: "Please try again later"
    });
  }

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const handleDownload = (voucherId: string) => {
    const startTime = performance.now();
    try {
      toast({
        title: "Download started",
        description: "Your voucher is being downloaded..."
      });
      // Implement voucher download logic
      trackVoucherPerformance('download', startTime);
    } catch (error) {
      trackVoucherError(error as Error, { voucherId });
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Please try again later"
      });
    }
  };

  const handlePrint = (voucherId: string) => {
    const startTime = performance.now();
    try {
      toast({
        title: "Print prepared",
        description: "Your voucher is ready to print..."
      });
      // Implement voucher print logic
      trackVoucherPerformance('print', startTime);
    } catch (error) {
      trackVoucherError(error as Error, { voucherId });
      toast({
        variant: "destructive",
        title: "Print failed",
        description: "Please try again later"
      });
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[200px] mt-4" />;
  }

  return (
    <VoucherErrorBoundary>
      <div className="mt-4">
        <VoucherList
          vouchers={data?.vouchers || []}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      </div>
    </VoucherErrorBoundary>
  );
};

export default VoucherManagement;