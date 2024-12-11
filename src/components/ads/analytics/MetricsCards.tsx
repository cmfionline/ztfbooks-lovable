import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, MousePointerClick, ShoppingCart, DollarSign } from "lucide-react";

interface MetricsCardsProps {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
}

export const MetricsCards = ({ 
  totalImpressions, 
  totalClicks, 
  totalConversions, 
  totalRevenue 
}: MetricsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Impressions</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple">{totalImpressions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Avg. {Math.floor(totalImpressions / 30).toLocaleString()} per day
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Clicks</CardTitle>
          <MousePointerClick className="h-4 w-4 text-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple">{totalClicks.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            CTR: {((totalClicks / totalImpressions) * 100).toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
          <ShoppingCart className="h-4 w-4 text-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple">{totalConversions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            CVR: {((totalConversions / totalClicks) * 100).toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple">${totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Avg. ${Math.floor(totalRevenue / 30).toLocaleString()} per day
          </p>
        </CardContent>
      </Card>
    </div>
  );
};