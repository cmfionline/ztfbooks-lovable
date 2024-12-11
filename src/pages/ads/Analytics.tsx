import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MetricsCards } from "@/components/ads/analytics/MetricsCards";
import { PerformanceChart } from "@/components/ads/analytics/PerformanceChart";
import { DeviceDistribution } from "@/components/ads/analytics/DeviceDistribution";
import { DiscountPerformance } from "@/components/ads/analytics/DiscountPerformance";
import { subDays } from 'date-fns';

const Analytics = () => {
  const { data: performanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['ad-performance'],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      
      const { data, error } = await supabase
        .from('ad_analytics')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: deviceStats, isLoading: isLoadingDevices } = useQuery({
    queryKey: ['device-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_analytics')
        .select('device_type, count')
        .not('device_type', 'is', null);

      if (error) throw error;
      return data;
    },
  });

  const { data: discountData, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ['discount-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_discount_analytics')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingPerformance || isLoadingDevices || isLoadingDiscounts) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalImpressions = performanceData?.reduce((sum, day) => sum + (day.impressions || 0), 0) || 0;
  const totalClicks = performanceData?.reduce((sum, day) => sum + (day.clicks || 0), 0) || 0;
  const totalConversions = performanceData?.reduce((sum, day) => sum + (day.conversions || 0), 0) || 0;
  const totalRevenue = performanceData?.reduce((sum, day) => sum + (day.revenue || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ad Analytics</h1>

        <MetricsCards
          totalImpressions={totalImpressions}
          totalClicks={totalClicks}
          totalConversions={totalConversions}
          totalRevenue={totalRevenue}
        />

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <PerformanceChart data={performanceData} />
          <DeviceDistribution data={deviceStats} />
        </div>

        <DiscountPerformance data={discountData} />
      </div>
    </div>
  );
};

export default Analytics;