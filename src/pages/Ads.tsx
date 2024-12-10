import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Ads = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Advertisements</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ad
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Banner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Active Campaign</p>
              <div className="mt-4">
                <Button variant="outline" className="w-full">Manage</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sidebar Ad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <div className="mt-4">
                <Button variant="outline" className="w-full">Manage</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Ads;