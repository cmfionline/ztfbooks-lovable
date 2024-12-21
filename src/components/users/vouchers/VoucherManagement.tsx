import { useState } from "react";
import { useVoucherData } from "./hooks/useVoucherData";
import { VoucherList } from "./components/VoucherList";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface VoucherManagementProps {
  clientId: string;
}

const ITEMS_PER_PAGE = 10;

const VoucherManagement = ({ clientId }: VoucherManagementProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const { data, isLoading } = useVoucherData(clientId, currentPage);
  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const handleDownload = (voucherId: string) => {
    toast({
      title: "Download started",
      description: "Your voucher is being downloaded..."
    });
    // Implement voucher download logic
  };

  const handlePrint = (voucherId: string) => {
    toast({
      title: "Print prepared",
      description: "Your voucher is ready to print..."
    });
    // Implement voucher print logic
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[200px] mt-4" />;
  }

  return (
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
  );
};

export default VoucherManagement;