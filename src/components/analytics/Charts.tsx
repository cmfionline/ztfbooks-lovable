import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";

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
      <Card>
        <CardHeader>
          <CardTitle>Sales vs Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <BarChart width={500} height={300} data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
              <Bar dataKey="downloads" fill="#82ca9d" />
            </BarChart>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <PieChart width={500} height={300}>
              <Pie
                data={languageData}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};