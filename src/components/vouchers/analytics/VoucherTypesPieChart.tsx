import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9"];

interface VoucherTypesPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export const VoucherTypesPieChart = ({ data }: VoucherTypesPieChartProps) => {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-purple-800">Voucher Types Distribution</CardTitle>
        <CardDescription>Breakdown by voucher type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #E5DEFF",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};