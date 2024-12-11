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
} from "recharts";

const VoucherAnalytics = () => {
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

      const revenue = totalRevenue?.reduce((sum, v) => sum + (v.total_amount || 0), 0) || 0;

      return {
        total: totalVouchers?.length || 0,
        redeemed: redeemedVouchers?.length || 0,
        revenue,
      };
    },
  });

  return (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default VoucherAnalytics;