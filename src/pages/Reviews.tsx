import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Reviews = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book Reviews</h1>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>The Great Gatsby</CardTitle>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <Button variant="outline">Approve</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "A masterpiece of American literature. The prose is beautiful and the story is timeless."
              </p>
              <p className="text-sm mt-2">- John Doe</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>1984</CardTitle>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <Button variant="outline">Approve</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                "A chilling dystopian novel that remains relevant today."
              </p>
              <p className="text-sm mt-2">- Jane Smith</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reviews;