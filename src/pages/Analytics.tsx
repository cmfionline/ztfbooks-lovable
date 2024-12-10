import { Filters } from "@/components/dashboard/Filters";
import { Charts } from "@/components/analytics/Charts";
import { MetricsCards } from "@/components/dashboard/MetricsCards";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
        <Filters />
        <MetricsCards />
        <Charts />
      </div>
    </div>
  );
};

export default Analytics;