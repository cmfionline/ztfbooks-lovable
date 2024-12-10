import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Statistics = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Statistics</h1>
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Statistics dashboard coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;