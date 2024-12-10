import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const PublishersPage = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Publishers Management</h1>
          <Link to="/books/publishers/add">
            <Button className="bg-purple hover:bg-purple/90">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Publisher
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Publishers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Publishers management dashboard coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublishersPage;