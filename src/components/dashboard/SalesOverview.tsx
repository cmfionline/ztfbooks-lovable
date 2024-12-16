import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SalesData {
  date: string;
  total_sales: number;
}

const SalesOverview = () => {
  const { data: salesData, isLoading, error } = useQuery<SalesData[]>({
    queryKey: ['sales-overview'],
    queryFn: async ({ signal }) => {
      try {
        const { data, error } = await supabase
          .from('sales_analytics')
          .select('date, total_sales')
          .order('date', { ascending: true })
          .limit(7)
          .abortSignal(signal);

        if (error) throw error;

        return data.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          total_sales: item.total_sales
        })) as SalesData[];
      } catch (error: any) {
        console.error('Error fetching sales overview:', error);
        throw new Error(error.message);
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (error) {
    toast({
      title: "Error loading sales overview",
      description: "Failed to load sales data. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-purple" />
          </div>
        ) : !salesData?.length ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No sales data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <Bar 
                dataKey="total_sales" 
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesOverview;