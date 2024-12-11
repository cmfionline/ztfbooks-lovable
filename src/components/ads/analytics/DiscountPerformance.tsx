import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DiscountPerformanceProps {
  data: any[];
}

export const DiscountPerformance = ({ data }: DiscountPerformanceProps) => {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-purple-800">Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis dataKey="ad_id" stroke="#8B5CF6" />
              <YAxis stroke="#8B5CF6" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #E5DEFF',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="redemption_count" 
                fill="#8B5CF6" 
                name="Redemptions"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="sales_impact" 
                fill="#EC4899" 
                name="Sales Impact ($)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};