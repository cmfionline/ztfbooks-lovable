import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const VoucherAnalytics = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['voucher-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*');
      
      if (error) throw error;
      
      const total = data.length;
      const redeemed = data.filter(v => v.redeemed).length;
      const active = total - redeemed;
      const totalAmount = data.reduce((sum, v) => sum + (v.total_amount || 0), 0);
      
      return { total, redeemed, active, totalAmount };
    }
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Voucher Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeemed Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.redeemed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoucherAnalytics;