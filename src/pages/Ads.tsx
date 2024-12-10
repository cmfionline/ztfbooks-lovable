import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Ads = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ads Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Advertisement Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ads management coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ads;