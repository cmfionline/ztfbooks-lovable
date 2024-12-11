import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

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

  const { data: deviceStats } = useQuery({
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

  if (isLoadingPerformance || isLoadingDiscounts) {
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Impressions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                CTR: {((totalClicks / totalImpressions) * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                CVR: {((totalConversions / totalClicks) * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    />
                    <Line type="monotone" dataKey="impressions" stroke="#8B5CF6" />
                    <Line type="monotone" dataKey="clicks" stroke="#EC4899" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceStats}
                      dataKey="count"
                      nameKey="device_type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => entry.device_type}
                    >
                      {deviceStats?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Discount Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={discountData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ad_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="redemption_count" fill="#8B5CF6" />
                  <Bar dataKey="sales_impact" fill="#EC4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;