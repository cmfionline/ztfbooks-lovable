import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSquare2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BasicInfoFields } from "./components/BasicInfoFields";
import { SocialMediaFields } from "./components/SocialMediaFields";
import { authorFormSchema, AuthorFormValues } from "./schema";

const EditAuthor = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: "",
      designation: "",
      education: "",
      nationality: "",
      date_of_birth: "",
      bio: "",
      mobile: "",
      address: "",
      description: "",
      website: "",
      facebook_url: "",
      twitter_url: "",
      instagram_url: "",
    },
  });

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
        data.photoUrl = publicUrl;
      }

      return data;
    },
  });

  useEffect(() => {
    if (author) {
      form.reset({
        name: author.name,
        designation: author.designation || "",
        education: author.education || "",
        nationality: author.nationality || "",
        date_of_birth: author.date_of_birth || "",
        bio: author.bio || "",
        mobile: author.mobile || "",
        address: author.address || "",
        description: author.description || "",
        website: author.website || "",
        facebook_url: author.facebook_url || "",
        twitter_url: author.twitter_url || "",
        instagram_url: author.instagram_url || "",
        photo: author.photoUrl || undefined,
      });
    }
  }, [author, form]);

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <BasicInfoFields control={form.control} currentPhoto={author?.photoUrl} />
                <SocialMediaFields control={form.control} />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/books/authors")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-purple hover:bg-purple/90 text-white"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Update Author"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAuthor;