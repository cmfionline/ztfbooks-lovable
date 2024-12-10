import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Faqs = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">FAQs</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>How do I download my ebook?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                After purchase, you can download your ebook from your library page in multiple formats including PDF, EPUB, and MOBI.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and various mobile payment solutions depending on your region.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Can I read on multiple devices?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Yes, you can access your purchased books on up to 5 different devices simultaneously.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Faqs;