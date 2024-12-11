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
      if (process.env.NODE_ENV === 'development') {
        return generateDemoPerformanceData(30);
      }

      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      
      const { data, error } = await supabase
        .from('ad_analytics')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      return data || generateDemoPerformanceData(30);
    },
  });

  const { data: deviceStats, isLoading: isLoadingDevices } = useQuery({
    queryKey: ['device-stats'],
    queryFn: async () => {
      if (process.env.NODE_ENV === 'development') {
        return [
          { device_type: 'Mobile', count: 2850 },
          { device_type: 'Desktop', count: 1950 },
          { device_type: 'Tablet', count: 850 },
          { device_type: 'Other', count: 150 }
        ];
      }

      const { data, error } = await supabase
        .rpc('get_device_stats');

      if (error) throw error;
      return data || [];
    },
  });

  const { data: discountData, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ['discount-analytics'],
    queryFn: async () => {
      if (process.env.NODE_ENV === 'development') {
        return [
          { ad_id: 'Summer Sale', redemption_count: 458, sales_impact: 22500 },
          { ad_id: 'Back to School', redemption_count: 385, sales_impact: 15800 },
          { ad_id: 'Holiday Special', redemption_count: 625, sales_impact: 31200 },
          { ad_id: 'Flash Sale', redemption_count: 289, sales_impact: 12400 }
        ];
      }

      const { data, error } = await supabase
        .from('ad_discount_analytics')
        .select('*');

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoadingPerformance || isLoadingDevices || isLoadingDiscounts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-purple-light/10 pt-20 px-4 md:px-8">
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
          <PerformanceChart data={performanceData || []} />
          <DeviceDistribution data={deviceStats || []} />
        </div>

        <DiscountPerformance data={discountData || []} />
      </div>
    </div>
  );
};

const generateDemoPerformanceData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    const baseImpressions = 1000 + Math.random() * 2000;
    const clicks = Math.floor(baseImpressions * (0.15 + Math.random() * 0.1));
    const conversions = Math.floor(clicks * (0.2 + Math.random() * 0.1));
    const revenue = conversions * (50 + Math.random() * 30);
    
    data.push({
      date: date.toISOString(),
      impressions: Math.floor(baseImpressions),
      clicks,
      conversions,
      revenue: Math.floor(revenue),
    });
  }
  
  return data;
};

export default Analytics;
