import { Filters } from "@/components/dashboard/Filters";
import SalesOverview from "@/components/dashboard/SalesOverview";
import RevenueMetrics from "@/components/dashboard/RevenueMetrics";
import BestSellingBooks from "@/components/dashboard/BestSellingBooks";
import RecentActivities from "@/components/dashboard/RecentActivities";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-purple-800">Dashboard</h1>
        
        <Filters />
        <RevenueMetrics />
        
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <SalesOverview />
          <div className="space-y-8">
            <BestSellingBooks />
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;