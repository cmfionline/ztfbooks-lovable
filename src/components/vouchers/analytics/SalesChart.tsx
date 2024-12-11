import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SalesChartProps {
  data: Array<{
    profiles: { full_name: string };
    total_sales: number;
  }>;
}

export const SalesChart = ({ data }: SalesChartProps) => {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-purple-800">Top Performing Sales Agents</CardTitle>
        <CardDescription>Based on total sales volume</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis
                dataKey="profiles.full_name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                stroke="#8B5CF6"
              />
              <YAxis stroke="#8B5CF6" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #E5DEFF",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="total_sales" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};