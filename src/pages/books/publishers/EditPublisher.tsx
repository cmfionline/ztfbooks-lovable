import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { EditPublisherForm } from "./components/EditPublisherForm";

const EditPublisher = () => {
  const { id } = useParams();

  const { data: publisher, isLoading } = useQuery({
    queryKey: ["publisher", id],
    queryFn: async () => {
      if (!id) throw new Error("Publisher ID is required");

      const { data, error } = await supabase
        .from("publishers")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching publisher:", error);
        throw error;
      }
      
      if (!data) {
        console.error("Publisher not found");
        throw new Error("Publisher not found");
      }

      // If there's a photo, get its public URL
      if (data.photo) {
        const { data: { publicUrl } } = supabase.storage
          .from('books')
          .getPublicUrl(data.photo);
        data.photoUrl = publicUrl;
      }

      return data;
    },
  });

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
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Edit Publisher
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditPublisherForm initialData={publisher} id={id!} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPublisher;