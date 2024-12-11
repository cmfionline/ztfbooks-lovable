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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

type VoucherTypeCount = {
  type: string;
  count: number;
}

export const VoucherAnalytics = () => {
  const { data: voucherStats } = useQuery({
    queryKey: ["voucher-stats"],
    queryFn: async () => {
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
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Vouchers</CardTitle>
            <CardDescription>Number of vouchers created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voucherStats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redeemed Vouchers</CardTitle>
            <CardDescription>Number of vouchers used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voucherStats?.redeemed || 0}</div>
            <div className="text-sm text-muted-foreground">
              {voucherStats?.total ? 
                `${((voucherStats.redeemed / voucherStats.total) * 100).toFixed(1)}% redemption rate` 
                : '0% redemption rate'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>From redeemed vouchers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${voucherStats?.revenue.toFixed(2) || "0.00"}
            </div>
            <div className="text-sm text-muted-foreground">
              ${voucherStats?.redeemed ? 
                (voucherStats.revenue / voucherStats.redeemed).toFixed(2) 
                : "0.00"} avg. per voucher
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Sales Agents</CardTitle>
            <CardDescription>Based on total sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={voucherStats?.salesAgentPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="profiles.full_name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voucher Types Distribution</CardTitle>
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
                  <Tooltip />
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