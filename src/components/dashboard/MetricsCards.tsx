import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Download, DollarSign, Globe, Languages } from "lucide-react";

export const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-purple-light to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple">$0</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">No data for this period</p>
            <div className="text-xs">
              <span className="text-success">Paid: $0</span>
              <span className="text-info ml-2">Free: 0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#FEC6A1] to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Total Downloads</CardTitle>
          <Download className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">0</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">No downloads yet</p>
            <div className="text-xs">
              <span className="text-success">Paid: 0</span>
              <span className="text-info ml-2">Free: 0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#D3E4FD] to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Total Titles</CardTitle>
          <BookOpen className="h-4 w-4 text-info" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">0</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">No books available</p>
            <div className="text-xs">
              <span>By ZTF: 0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#FFDEE2] to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Languages</CardTitle>
          <Languages className="h-4 w-4 text-danger" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-danger">0</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">No languages added</p>
            <div className="text-xs">
              <span>Add languages</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#F2FCE2] to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Countries</CardTitle>
          <Globe className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">0</div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">No countries reached</p>
            <div className="text-xs">
              <span>Expand reach</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};