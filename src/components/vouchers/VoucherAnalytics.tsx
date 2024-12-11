import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./analytics/StatCard";
import { SalesChart } from "./analytics/SalesChart";
import { VoucherTypesPieChart } from "./analytics/VoucherTypesPieChart";

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
        .select(
          `
          *,
          profiles (
            full_name
          )
        `
        )
        .order("total_sales", { ascending: false })
        .limit(5);

      const { data: voucherTypes } = await supabase.rpc("get_voucher_type_counts");

      const revenue =
        totalRevenue?.reduce((sum, v) => sum + (v.total_amount || 0), 0) || 0;

      return {
        total: totalVouchers?.length || 0,
        redeemed: redeemedVouchers?.length || 0,
        revenue,
        salesAgentPerformance: salesAgentPerformance || [],
        voucherTypes:
          voucherTypes?.map((vt) => ({
            name: vt.type,
            value: parseInt(vt.count.toString()),
          })) || [],
      };
    },
  });

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-purple-50 to-white">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Vouchers"
          description="Number of vouchers created"
          value={voucherStats?.total || 0}
          className="bg-gradient-to-r from-purple-100 to-purple-50"
        />

        <StatCard
          title="Redeemed Vouchers"
          description="Number of vouchers used"
          value={voucherStats?.redeemed || 0}
          subValue={
            voucherStats?.total
              ? `${(
                  (voucherStats.redeemed / voucherStats.total) *
                  100
                ).toFixed(1)}% redemption rate`
              : "0% redemption rate"
          }
          className="bg-gradient-to-r from-orange-100 to-rose-50"
        />

        <StatCard
          title="Total Revenue"
          description="From redeemed vouchers"
          value={`$${voucherStats?.revenue.toFixed(2) || "0.00"}`}
          subValue={
            `$${
              voucherStats?.redeemed
                ? (voucherStats.revenue / voucherStats.redeemed).toFixed(2)
                : "0.00"
            } avg. per voucher`
          }
          className="bg-gradient-to-r from-green-100 to-emerald-50"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart data={voucherStats?.salesAgentPerformance || []} />
        <VoucherTypesPieChart data={voucherStats?.voucherTypes || []} />
      </div>
    </div>
  );
};

export default VoucherAnalytics;