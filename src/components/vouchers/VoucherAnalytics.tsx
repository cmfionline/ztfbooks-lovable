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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Modern color palette
const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9"];

// Demo data for development and testing
const DEMO_MODE = true;

const demoData = {
  total: 1250,
  redeemed: 875,
  revenue: 43750,
  salesAgentPerformance: [
    { profiles: { full_name: "John Smith" }, total_sales: 15000 },
    { profiles: { full_name: "Emma Wilson" }, total_sales: 12500 },
    { profiles: { full_name: "Michael Brown" }, total_sales: 10000 },
    { profiles: { full_name: "Sarah Davis" }, total_sales: 8500 },
    { profiles: { full_name: "James Johnson" }, total_sales: 7000 },
  ],
  voucherTypes: [
    { name: "Standard", value: 450 },
    { name: "Premium", value: 300 },
    { name: "Student", value: 280 },
    { name: "Enterprise", value: 220 },
  ],
};

export const VoucherAnalytics = () => {
  const { data: voucherStats } = useQuery({
    queryKey: ["voucher-stats"],
    queryFn: async () => {
      if (DEMO_MODE) return demoData;

      const { data: totalVouchers } = await supabase
        .from("vouchers")
        .select("*", { count: "exact" });

      const { data: redeemedVouchers } = await supabase
        .from("vouchers")
        .select("*", { count: "exact" })
        .eq("redeemed", true);

      const { data: totalRevenue } = await supabase
        .from("vouchers")
        .select("total_amount")
        .eq("redeemed", true);

      const { data: salesAgentPerformance } = await supabase
        .from("sales_agents")
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order("total_sales", { ascending: false })
        .limit(5);

      const { data: voucherTypes } = await supabase
        .rpc('get_voucher_type_counts');

      const revenue = totalRevenue?.reduce((sum, v) => sum + (v.total_amount || 0), 0) || 0;

      return {
        total: totalVouchers?.length || 0,
        redeemed: redeemedVouchers?.length || 0,
        revenue,
        salesAgentPerformance: salesAgentPerformance || [],
        voucherTypes: voucherTypes?.map(vt => ({
          name: vt.type,
          value: parseInt(vt.count.toString())
        })) || []
      };
    },
  });

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-purple-50 to-white">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-purple-800">Total Vouchers</CardTitle>
            <CardDescription>Number of vouchers created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">{voucherStats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-purple-800">Redeemed Vouchers</CardTitle>
            <CardDescription>Number of vouchers used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">{voucherStats?.redeemed || 0}</div>
            <div className="text-sm text-purple-500 mt-2">
              {voucherStats?.total ? 
                `${((voucherStats.redeemed / voucherStats.total) * 100).toFixed(1)}% redemption rate` 
                : '0% redemption rate'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-purple-800">Total Revenue</CardTitle>
            <CardDescription>From redeemed vouchers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">
              ${voucherStats?.revenue.toFixed(2) || "0.00"}
            </div>
            <div className="text-sm text-purple-500 mt-2">
              ${voucherStats?.redeemed ? 
                (voucherStats.revenue / voucherStats.redeemed).toFixed(2) 
                : "0.00"} avg. per voucher
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-800">Top Performing Sales Agents</CardTitle>
            <CardDescription>Based on total sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={voucherStats?.salesAgentPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
                  <XAxis 
                    dataKey="profiles.full_name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    stroke="#8B5CF6"
                  />
                  <YAxis stroke="#8B5CF6" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #E5DEFF',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="total_sales" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-800">Voucher Types Distribution</CardTitle>
            <CardDescription>Breakdown by voucher type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={voucherStats?.voucherTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {voucherStats?.voucherTypes?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #E5DEFF',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoucherAnalytics;