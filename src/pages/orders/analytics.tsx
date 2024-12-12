import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { StatCard } from "@/components/orders/analytics/StatCard";
import { SalesChart } from "@/components/orders/analytics/SalesChart";
import { OrdersChart } from "@/components/orders/analytics/OrdersChart";

// Demo data for development and testing
const DEMO_MODE = true;

const demoData = {
  salesData: [
    { date: '2024-03-01', sales: 2500, orders: 125 },
    { date: '2024-03-02', sales: 3200, orders: 145 },
    { date: '2024-03-03', sales: 2800, orders: 130 },
    { date: '2024-03-04', sales: 3800, orders: 160 },
    { date: '2024-03-05', sales: 2900, orders: 135 },
    { date: '2024-03-06', sales: 4200, orders: 180 },
    { date: '2024-03-07', sales: 3600, orders: 155 },
  ],
  totalOrders: 1030,
  totalRevenue: 23500,
  completedOrders: 985,
};

const OrderAnalytics = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("7days");

  const { data: analytics } = useQuery({
    queryKey: ["order-analytics", timeRange],
    queryFn: async () => {
      if (DEMO_MODE) return demoData;

      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching analytics",
          description: error.message,
        });
        throw error;
      }

      // Process the data for charts
      const salesByDay = orders.reduce((acc: any, order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            date,
            sales: 0,
            orders: 0,
          };
        }
        acc[date].sales += order.total_amount;
        acc[date].orders += 1;
        return acc;
      }, {});

      return {
        salesData: Object.values(salesByDay),
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
        completedOrders: orders.filter((o) => o.status === "completed").length,
      };
    },
  });

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-purple-50 to-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-900 animate-fade-in">
            Order Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your order and revenue metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Orders"
          value={analytics?.totalOrders || 0}
          description="All time orders"
          subValue={`${Math.round((analytics?.completedOrders || 0) / (analytics?.totalOrders || 1) * 100)}% completion rate`}
        />

        <StatCard
          title="Total Revenue"
          value={`$${analytics?.totalRevenue?.toFixed(2) || "0.00"}`}
          description="All time revenue"
          subValue={`$${((analytics?.totalRevenue || 0) / (analytics?.totalOrders || 1)).toFixed(2)} avg. per order`}
        />

        <StatCard
          title="Completed Orders"
          value={analytics?.completedOrders || 0}
          description="Successfully delivered"
          subValue={`${analytics?.totalOrders - (analytics?.completedOrders || 0)} pending`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart
          data={analytics?.salesData || []}
          title="Daily Sales"
          description="Revenue over time"
        />
        <OrdersChart
          data={analytics?.salesData || []}
          title="Orders by Day"
          description="Daily order volume"
        />
      </div>
    </div>
  );
};

export default OrderAnalytics;