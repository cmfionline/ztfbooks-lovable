import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { subDays, format } from "date-fns";

const SalesOverview = () => {
  const { data: salesData } = useQuery({
    queryKey: ["sales-overview"],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);

      const { data, error } = await supabase
        .from("sales_analytics")
        .select("*")
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .order("date", { ascending: true });

      if (error) throw error;

      return data?.map(item => ({
        ...item,
        date: format(new Date(item.date), "MMM dd"),
      })) || [];
    },
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
              <XAxis 
                dataKey="date" 
                stroke="#8B5CF6"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                stroke="#8B5CF6"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #E5DEFF',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="total_revenue"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="total_sales"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: '#22C55E', strokeWidth: 2 }}
                name="Sales"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesOverview;