import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Download, DollarSign, Globe, Languages } from "lucide-react";

export const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">+20.1% from last period</p>
            <div className="text-xs">
              <span className="text-green-500">Paid: $38,945</span>
              <span className="text-blue-500 ml-2">Free: 6,286</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,350</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">+15% from last period</p>
            <div className="text-xs">
              <span className="text-green-500">Paid: 1,890</span>
              <span className="text-blue-500 ml-2">Free: 460</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Titles</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">348</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">+4 new this period</p>
            <div className="text-xs">
              <span>By ZTF: 156</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Languages</CardTitle>
          <Languages className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">+2 new this period</p>
            <div className="text-xs">
              <span>Most: English, French</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Countries</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">142</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">+5 new this period</p>
            <div className="text-xs">
              <span>Top: US, FR, CM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};