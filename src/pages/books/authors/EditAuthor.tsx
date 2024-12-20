import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserSquare2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthorForm } from "./components/AuthorForm";
import { AuthorFormValues } from "./schema";
import { Author } from "./types";

const EditAuthor = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: author, isLoading } = useQuery({
    queryKey: ["author", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching author",
          description: error.message,
        });
        throw error;
      }

      if (!data) {
        toast({
          variant: "destructive",
          title: "Author not found",
          description: "The requested author could not be found.",
        });
        throw new Error("Author not found");
      }

      // If there's a photo, get its public URL
      if (data.photo) {
        const { data: { publicUrl } } = supabase.storage
          .from('books')
          .getPublicUrl(data.photo);
        return { ...data, photoUrl: publicUrl } as Author;
      }

      return data as Author;
    },
  });

  const onSubmit = async (values: AuthorFormValues) => {
    try {
      let photoPath = author?.photo;

      // Handle photo upload if a new file is selected
      if (values.photo instanceof File) {
        const fileExt = values.photo.name.split('.').pop();
        const fileName = `authors/${id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('books')
          .upload(fileName, values.photo, {
            upsert: true
          });

        if (uploadError) throw uploadError;
        photoPath = fileName;
      }

      const { error } = await supabase
        .from("authors")
        .update({
          name: values.name,
          designation: values.designation || null,
          education: values.education || null,
          nationality: values.nationality || null,
          date_of_birth: values.date_of_birth || null,
          bio: values.bio || null,
          mobile: values.mobile || null,
          address: values.address || null,
          description: values.description || null,
          website: values.website || null,
          facebook_url: values.facebook_url || null,
          twitter_url: values.twitter_url || null,
          instagram_url: values.instagram_url || null,
          photo: photoPath,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Author has been updated successfully",
      });

      navigate("/books/authors");
    } catch (error: any) {
      console.error("Error updating author:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update author. Please try again.",
        variant: "destructive",
      });
    }
  };

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
              <UserSquare2 className="w-6 h-6" />
              Edit Author
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AuthorForm author={author} onSubmit={onSubmit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAuthor;