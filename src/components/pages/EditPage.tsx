import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import PageForm from "./PageForm";
import { useToast } from "@/hooks/use-toast";
import { FileEdit, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Page } from "./types";

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

      return data as Page;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <Card className="p-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple" />
          </Card>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground">Page not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-primary">
          <FileEdit className="w-8 h-8 text-purple" />
          Edit Page
        </h1>
        <PageForm initialData={page} isEditing />
      </div>
    </div>
  );
};

export default EditPage;