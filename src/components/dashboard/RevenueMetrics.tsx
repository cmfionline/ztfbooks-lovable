import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react";

const RevenueMetrics = () => {
  const { data: metrics } = useQuery({
    queryKey: ["revenue-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_analytics")
        .select("total_revenue, total_sales, total_orders")
        .order("date", { ascending: false })
        .limit(30);

      if (error) throw error;

      const totalRevenue = data?.reduce((sum, item) => sum + item.total_revenue, 0) || 0;
      const totalSales = data?.reduce((sum, item) => sum + item.total_sales, 0) || 0;
      const totalOrders = data?.reduce((sum, item) => sum + item.total_orders, 0) || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalRevenue,
        totalSales,
        totalOrders,
        avgOrderValue,
      };
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple">
            ${metrics?.totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last 30 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Sales
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple">
            {metrics?.totalSales}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Books sold
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Orders
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple">
            {metrics?.totalOrders}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Completed orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg. Order Value
          </CardTitle>
          <Users className="h-4 w-4 text-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple">
            ${metrics?.avgOrderValue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per order
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueMetrics;