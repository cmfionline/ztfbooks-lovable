import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
      return data || generateDemoData(30);
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
      return data || [
        { device_type: 'Mobile', count: 1250 },
        { device_type: 'Desktop', count: 850 },
        { device_type: 'Tablet', count: 400 },
        { device_type: 'Other', count: 100 }
      ];
    },
  });

  const { data: discountData, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ['discount-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_discount_analytics')
        .select('*');

      if (error) throw error;
      return data || [
        { ad_id: 'Campaign A', redemption_count: 245, sales_impact: 12500 },
        { ad_id: 'Campaign B', redemption_count: 189, sales_impact: 9500 },
        { ad_id: 'Campaign C', redemption_count: 328, sales_impact: 15800 },
        { ad_id: 'Campaign D', redemption_count: 156, sales_impact: 7200 }
      ];
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
    <div className="min-h-screen bg-gradient-to-br from-background to-purple-light/10 pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-800">Ad Analytics</h1>
          <div className="text-sm text-muted-foreground">Last 30 days</div>
        </div>

        <MetricsCards
          totalImpressions={totalImpressions}
          totalClicks={totalClicks}
          totalConversions={totalConversions}
          totalRevenue={totalRevenue}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <PerformanceChart data={performanceData} />
          <DeviceDistribution data={deviceStats} />
        </div>

        <DiscountPerformance data={discountData} />
      </div>
    </div>
  );
};

const generateDemoData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    data.push({
      date: date.toISOString(),
      impressions: Math.floor(Math.random() * 1000) + 500,
      clicks: Math.floor(Math.random() * 200) + 50,
      conversions: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 1000) + 200,
    });
  }
  
  return data;
};

export default Analytics;