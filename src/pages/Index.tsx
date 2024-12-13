import { useState } from "react";
import { Filters } from "@/components/dashboard/Filters";
import SalesOverview from "@/components/dashboard/SalesOverview";
import RevenueMetrics from "@/components/dashboard/RevenueMetrics";
import BestSellingBooks from "@/components/dashboard/BestSellingBooks";
import RecentActivities from "@/components/dashboard/RecentActivities";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleError = (error: Error) => {
    console.error("Dashboard error:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "There was a problem loading the dashboard. Please try again.",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8" role="main">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-purple-800" id="dashboard-title">
          Dashboard
        </h1>

        <div aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-purple" />
            </div>
          ) : (
            <>
              <Filters />
              <RevenueMetrics />

              <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <SalesOverview />
                </div>
                <div className="space-y-8">
                  <BestSellingBooks />
                  <RecentActivities />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;