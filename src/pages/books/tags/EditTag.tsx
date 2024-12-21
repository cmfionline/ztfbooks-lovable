import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Tag, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const EditTag = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  console.log("EditTag mounted with id:", id); // Debug log

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data: tag, isLoading, error } = useQuery({
    queryKey: ["tag", id],
    queryFn: async () => {
      console.log("Fetching tag data for id:", id); // Debug log
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching tag:", error); // Debug log
        throw error;
      }
      
      console.log("Fetched tag data:", data); // Debug log
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Updating tag with values:", values); // Debug log
      const { data, error } = await supabase
        .from("tags")
        .update({ name: values.name })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating tag:", error); // Debug log
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
      console.error("Mutation error:", error); // Debug log
      toast({
        title: "Error",
        description: error.message || "Failed to update tag. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (tag) {
      console.log("Setting form values with tag:", tag); // Debug log
      form.reset({
        name: tag.name,
      });
    }
  }, [tag, form]);

  const onSubmit = async (values: FormValues) => {
    console.log("Form submitted with values:", values); // Debug log
    updateMutation.mutate(values);
  };

  if (error) {
    console.error("Query error:", error); // Debug log
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-12 w-full" />
              </div>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="border-purple-light focus:border-purple focus:ring-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate("/books/tags")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-purple hover:bg-purple/90 text-white"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Update Tag"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </QueryErrorBoundary>
      </div>
    </div>
  );
};

export default EditTag;