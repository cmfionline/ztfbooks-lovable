import { Filters } from "@/components/dashboard/Filters";
import { Charts } from "@/components/analytics/Charts";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { ZTFBooks } from "@/components/dashboard/ZTFBooks";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome to ZTF Books Admin</p>
        </div>

        <Filters />
        <MetricsCards />
        <Charts />
        <ZTFBooks />
      </div>
    </div>
  );
};

export default Dashboard;