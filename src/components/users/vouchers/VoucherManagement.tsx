import { useState } from "react";
import { useVoucherData } from "./hooks/useVoucherData";
import { VoucherList } from "./components/VoucherList";
import { VoucherBatchActions } from "./components/VoucherBatchActions";
import { VoucherAuditLog } from "./components/VoucherAuditLog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { 
  trackVoucherError, 
  trackVoucherPerformance, 
  measureVoucherMetrics 
} from "./monitoring/VoucherMetrics";
import { VoucherErrorBoundary } from "./components/VoucherErrorBoundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VoucherManagementProps {
  clientId: string;
}

const ITEMS_PER_PAGE = 10;

const VoucherManagement = ({ clientId }: VoucherManagementProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);
  const { toast } = useToast();
  
  const startTime = performance.now();
  const { data, isLoading, error, refetch } = useVoucherData(clientId, currentPage);
  
  if (data) {
    trackVoucherPerformance('data-fetch', startTime);
    const metrics = measureVoucherMetrics(data.vouchers);
    console.log('Voucher Metrics:', metrics);
  }

  if (error) {
    trackVoucherError(error as Error, { clientId, currentPage });
    toast({
      variant: "destructive",
      title: "Error loading vouchers",
      description: "Please try again later"
    });
  }

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const handleBatchComplete = () => {
    setSelectedVouchers([]);
    refetch();
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[200px] mt-4" />;
  }

  return (
    <VoucherErrorBoundary>
      <div className="space-y-6">
        <VoucherBatchActions 
          selectedVouchers={selectedVouchers}
          onComplete={handleBatchComplete}
        />

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Vouchers</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <VoucherList
              vouchers={data?.vouchers || []}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              selectedVouchers={selectedVouchers}
              onSelectionChange={setSelectedVouchers}
            />
          </TabsContent>

          <TabsContent value="audit">
            <VoucherAuditLog />
          </TabsContent>
        </Tabs>
      </div>
    </VoucherErrorBoundary>
  );
};

export default VoucherManagement;