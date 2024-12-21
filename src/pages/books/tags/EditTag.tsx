import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Tag } from "lucide-react";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";
import { TagForm } from "./components/TagForm";

const EditTag = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  console.log("EditTag mounted with id:", id);

  const { data: tag, isLoading, error } = useQuery({
    queryKey: ["tag", id],
    queryFn: async () => {
      console.log("Fetching tag data for id:", id);
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching tag:", error);
        throw error;
      }
      
      console.log("Fetched tag data:", data);
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: { name: string }) => {
      console.log("Updating tag with values:", values);
      const { data, error } = await supabase
        .from("tags")
        .update({ name: values.name })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating tag:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tag has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      navigate("/books/tags");
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update tag. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-destructive/10 text-destructive">
            <CardContent className="p-6">
              <p>Error loading tag: {error.message}</p>
              <Button
                onClick={() => navigate("/books/tags")}
                variant="outline"
                className="mt-4"
              >
                Back to Tags
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <QueryErrorBoundary>
          <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Tag className="w-6 h-6" />
                Edit Tag
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <TagForm
                  defaultValues={tag}
                  onSubmit={updateMutation.mutate}
                  onCancel={() => navigate("/books/tags")}
                  isLoading={updateMutation.isPending}
                />
              )}
            </CardContent>
          </Card>
        </QueryErrorBoundary>
      </div>
    </div>
  );
};

export default EditTag;