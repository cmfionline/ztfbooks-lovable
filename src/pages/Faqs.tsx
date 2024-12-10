import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Faqs = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">FAQs Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>FAQs management coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Faqs;