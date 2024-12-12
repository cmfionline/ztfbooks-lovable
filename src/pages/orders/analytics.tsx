import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useState } from "react";

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
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-purple-900">Order Analytics</h1>
          <p className="text-muted-foreground">
            Track your order and revenue metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-purple-800">Total Orders</CardTitle>
            <CardDescription>All time orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{analytics?.totalOrders || 0}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round((analytics?.completedOrders || 0) / (analytics?.totalOrders || 1) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-purple-800">Total Revenue</CardTitle>
            <CardDescription>All time revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              ${analytics?.totalRevenue?.toFixed(2) || "0.00"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ${((analytics?.totalRevenue || 0) / (analytics?.totalOrders || 1)).toFixed(2)} avg. per order
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-purple-800">Completed Orders</CardTitle>
            <CardDescription>Successfully delivered</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{analytics?.completedOrders || 0}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {analytics?.totalOrders - (analytics?.completedOrders || 0)} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-800">Daily Sales</CardTitle>
            <CardDescription>Revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.salesData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#8B5CF6"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#8B5CF6"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #E5DEFF',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                    name="Sales ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-800">Orders by Day</CardTitle>
            <CardDescription>Daily order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.salesData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#8B5CF6"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#8B5CF6"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #E5DEFF',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                    name="Number of Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderAnalytics;