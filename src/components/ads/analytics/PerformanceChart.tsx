import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

interface PerformanceChartProps {
  data: any[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-purple-800">Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MMM d')}
                stroke="#8B5CF6"
              />
              <YAxis stroke="#8B5CF6" />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #E5DEFF',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="impressions" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
                name="Impressions"
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#EC4899" 
                strokeWidth={2}
                dot={false}
                name="Clicks"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};