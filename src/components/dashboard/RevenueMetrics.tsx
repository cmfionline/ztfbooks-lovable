import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const RevenueMetrics = () => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['revenue-metrics'],
    queryFn: async ({ signal }) => {
      try {
        const { data, error } = await supabase
          .from('sales_analytics')
          .select('total_revenue, total_sales, total_orders')
          .order('date', { ascending: false })
          .limit(1)
          .abortSignal(signal)
          .single();

        if (error) {
          console.error('Error fetching revenue metrics:', error);
          throw error;
        }
        return data;
      } catch (error: any) {
        console.error('Error:', error);
        throw new Error(error.message);
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (error) {
    toast({
      title: "Error loading metrics",
      description: "Failed to load revenue metrics. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="text-2xl font-bold">
              ${metrics?.total_revenue?.toFixed(2) || '0.00'}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="text-2xl font-bold">{metrics?.total_sales || 0}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="text-2xl font-bold">{metrics?.total_orders || 0}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueMetrics;