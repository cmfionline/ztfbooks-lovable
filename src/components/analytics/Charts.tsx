import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

const salesData = [
  { month: "Jan", sales: 4000, downloads: 2400 },
  { month: "Feb", sales: 3000, downloads: 1398 },
  { month: "Mar", sales: 2000, downloads: 9800 },
  { month: "Apr", sales: 2780, downloads: 3908 },
  { month: "May", sales: 1890, downloads: 4800 },
  { month: "Jun", sales: 2390, downloads: 3800 },
];

const languageData = [
  { name: "English", value: 400 },
  { name: "French", value: 300 },
  { name: "Spanish", value: 300 },
  { name: "Portuguese", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const Charts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="w-full bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-800">Sales vs Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #E5DEFF',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                  name="Sales"
                />
                <Bar 
                  dataKey="downloads" 
                  fill="#82ca9d" 
                  radius={[4, 4, 0, 0]}
                  name="Downloads"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-purple-800">Language Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {languageData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #E5DEFF',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};