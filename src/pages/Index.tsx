import { useState } from "react";
import Navigation from "@/components/Navigation";
import { TimeFilter, TimeFilterValue } from "@/components/dashboard/TimeFilter";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { ZTFBooks } from "@/components/dashboard/ZTFBooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, BookOpen, Download, DollarSign, TrendingUp, Users, BookMarked, BookText, Layers } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilterValue>("this_week");

  // Sample data - replace with real data from your backend
  const salesData = [
    { month: "Jan", sales: 65, paid: 45, free: 20 },
    { month: "Feb", sales: 59, paid: 40, free: 19 },
    { month: "Mar", sales: 80, paid: 60, free: 20 },
    { month: "Apr", sales: 81, paid: 65, free: 16 },
    { month: "May", sales: 56, paid: 40, free: 16 },
    { month: "Jun", sales: 55, paid: 38, free: 17 },
  ];

  const downloadData = [
    { month: "Jan", downloads: 120, series: "Fantasy Series", author: "J.K. Smith" },
    { month: "Feb", downloads: 145, series: "Mystery Collection", author: "M.R. James" },
    { month: "Mar", downloads: 190, series: "Fantasy Series", author: "J.K. Smith" },
    { month: "Apr", downloads: 178, series: "Sci-Fi Saga", author: "A.C. Clarke" },
    { month: "May", downloads: 210, series: "Mystery Collection", author: "M.R. James" },
    { month: "Jun", downloads: 240, series: "Fantasy Series", author: "J.K. Smith" },
  ];

  const bestSellers = [
    { title: "The Art of Programming", sales: 1234, revenue: "$12,340", author: "John Doe", series: "Tech Essentials", type: "Paid" },
    { title: "Data Structures Explained", sales: 956, revenue: "$9,560", author: "Jane Smith", series: "CS Fundamentals", type: "Paid" },
    { title: "Machine Learning Basics", sales: 845, revenue: "$8,450", author: "Alan Turing", series: "AI Series", type: "Free" },
    { title: "Web Development Guide", sales: 789, revenue: "$7,890", author: "Sarah Johnson", series: "Web Dev", type: "Paid" },
    { title: "Python for Beginners", sales: 654, revenue: "$6,540", author: "Mike Python", series: "Programming 101", type: "Free" },
  ];

  const topAuthors = [
    { name: "John Doe", books: 12, totalSales: 15234, revenue: "$152,340" },
    { name: "Jane Smith", books: 8, totalSales: 12956, revenue: "$129,560" },
    { name: "Alan Turing", books: 5, totalSales: 10845, revenue: "$108,450" },
    { name: "Sarah Johnson", books: 6, totalSales: 9789, revenue: "$97,890" },
    { name: "Mike Python", books: 4, totalSales: 8654, revenue: "$86,540" },
  ];

  const topSeries = [
    { name: "Tech Essentials", books: 5, totalSales: 25234, revenue: "$252,340" },
    { name: "CS Fundamentals", books: 4, totalSales: 22956, revenue: "$229,560" },
    { name: "AI Series", books: 3, totalSales: 20845, revenue: "$208,450" },
    { name: "Web Dev", books: 4, totalSales: 19789, revenue: "$197,890" },
    { name: "Programming 101", books: 3, totalSales: 18654, revenue: "$186,540" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">ZTF Books Dashboard</h1>
            <TimeFilter value={timeFilter} onValueChange={setTimeFilter} />
          </div>
          
          <MetricsCards />
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sales Distribution (Paid vs Free)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]" config={{}}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9EE755" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9EE755" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="freeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CFDD3C" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#CFDD3C" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="paid" stackId="1" stroke="#9EE755" fillOpacity={1} fill="url(#paidGradient)" name="Paid" />
                    <Area type="monotone" dataKey="free" stackId="1" stroke="#CFDD3C" fillOpacity={1} fill="url(#freeGradient)" name="Free" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Downloads by Series</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]" config={{}}>
                  <LineChart data={downloadData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="downloads" stroke="#CFDD3C" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* ZTF Books Section */}
          <ZTFBooks />

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Best Sellers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Best Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Series</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bestSellers.map((book, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>{book.series}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${book.type === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {book.type}
                            </span>
                          </TableCell>
                          <TableCell>{book.revenue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Top Authors Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Authors</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Books</TableHead>
                        <TableHead>Total Sales</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topAuthors.map((author, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{author.name}</TableCell>
                          <TableCell>{author.books}</TableCell>
                          <TableCell>{author.totalSales.toLocaleString()}</TableCell>
                          <TableCell>{author.revenue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Series Performance */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Series Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Series Name</TableHead>
                      <TableHead>Books in Series</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSeries.map((series, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{series.name}</TableCell>
                        <TableCell>{series.books}</TableCell>
                        <TableCell>{series.totalSales.toLocaleString()}</TableCell>
                        <TableCell>{series.revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4" />
                  <p>Geographic map visualization would go here</p>
                  <p className="text-sm">Integration with a mapping library required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
