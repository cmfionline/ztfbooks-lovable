import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeriesForm } from "./components/SeriesForm";

const AddSeries = () => {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Add New Series</CardTitle>
        </CardHeader>
        <CardContent>
          <SeriesForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSeries;