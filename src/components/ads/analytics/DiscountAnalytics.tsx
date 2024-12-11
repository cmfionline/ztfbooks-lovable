import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DiscountAnalyticsProps {
  adId: string;
}

export const DiscountAnalytics = ({ adId }: DiscountAnalyticsProps) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['ad-discount-analytics', adId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_discount_analytics')
        .select('*')
        .eq('ad_id', adId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
    </div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Redemption Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.redemption_count || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Total number of times this discount was used
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${analytics?.sales_impact?.toFixed(2) || '0.00'}
          </div>
          <p className="text-xs text-muted-foreground">
            Additional revenue generated from this discount
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>ROI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Investment', value: 100 },
                { name: 'Returns', value: analytics?.roi || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8B5CF6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};