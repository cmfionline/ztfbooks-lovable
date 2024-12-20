import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSquare2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthorForm } from "./components/AuthorForm";
import { AuthorFormValues } from "./schema";
import { Author } from "./types";
import { EditBookError } from "../components/EditBookError";
import { useState } from "react";

const EditAuthor = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: author, isLoading, error } = useQuery({
    queryKey: ["author", id],
    queryFn: async () => {
      if (!id) throw new Error("Author ID is required");

      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Author not found");

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
      setIsSubmitting(true);
      if (!id) throw new Error("Author ID is required");

      let photoPath = author?.photo;

      // Handle photo upload if a new file is selected
      if (values.photo instanceof File) {
        const fileExt = values.photo.name.split('.').pop();
        const fileName = `authors/${id}-${Date.now()}.${fileExt}`;
        
        // Delete old photo if exists
        if (author?.photo) {
          await supabase.storage
            .from('books')
            .remove([author.photo]);
        }

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
          nationality: values.nationality || null,
          date_of_birth: values.date_of_birth || null,
          bio: values.bio || null,
          website: values.website || null,
          facebook_url: values.facebook_url || null,
          twitter_url: values.twitter_url || null,
          instagram_url: values.instagram_url || null,
          photo: photoPath,
          designation: values.designation || null,
          education: values.education || null,
          mobile: values.mobile || null,
          address: values.address || null,
          description: values.description || null,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Author updated successfully",
      });

      navigate("/books/authors");
    } catch (error: any) {
      console.error("Error updating author:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update author",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <EditBookError error={error as Error} />;
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
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <UserSquare2 className="w-6 h-6" />
              Edit Author
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AuthorForm 
              author={author} 
              onSubmit={onSubmit}
              isSubmitting={isSubmitting} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAuthor;