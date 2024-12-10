import { useState } from "react";
import { TimeFilter, TimeFilterValue } from "@/components/dashboard/TimeFilter";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { ZTFBooks } from "@/components/dashboard/ZTFBooks";
import { Charts } from "@/components/analytics/Charts";
import { Filters } from "@/components/dashboard/Filters";

const Index = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilterValue>("this_week");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ZTF Books Dashboard</h1>
        <Filters />
        <MetricsCards />
        <Charts />
        <ZTFBooks />
      </div>
    </div>
  );
};

export default Index;