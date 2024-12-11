import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageForm from "./PageForm";
import { useToast } from "@/components/ui/use-toast";

const EditPage = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching page",
          description: error.message,
        });
        return null;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Page</h1>
        <PageForm initialData={page} isEditing />
      </div>
    </div>
  );
};

export default EditPage;