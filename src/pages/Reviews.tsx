import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Reviews = () => {
  const { toast } = useToast();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["book-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_activities")
        .select(`
          *,
          profiles (
            full_name
          ),
          books (
            title,
            cover_image
          )
        `)
        .eq("activity_type", "review")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching reviews",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });

  const handleApproveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("customer_activities")
        .update({ metadata: { status: "approved" } })
        .eq("id", reviewId);

      if (error) throw error;

      toast({
        title: "Review approved",
        description: "The review has been approved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error approving review",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Book Reviews</h1>
          <div className="grid gap-4">
            <Card className="animate-pulse">
              <CardHeader className="h-32 bg-muted" />
            </Card>
            <Card className="animate-pulse">
              <CardHeader className="h-32 bg-muted" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!reviews?.length) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Book Reviews</h1>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No reviews found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book Reviews</h1>
        <div className="grid gap-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{review.books?.title}</CardTitle>
                    <div className="flex items-center mt-2">
                      {[...Array(review.metadata?.rating || 0)].map((_, index) => (
                        <Star
                          key={index}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => handleApproveReview(review.id)}
                    disabled={review.metadata?.status === "approved"}
                  >
                    {review.metadata?.status === "approved" ? "Approved" : "Approve"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {review.metadata?.comment || "No comment provided"}
                </p>
                <p className="text-sm mt-2">
                  - {review.profiles?.full_name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;