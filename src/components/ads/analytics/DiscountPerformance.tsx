import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DiscountPerformanceProps {
  data: any[];
}

export const DiscountPerformance = ({ data }: DiscountPerformanceProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Discount Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
  );
};