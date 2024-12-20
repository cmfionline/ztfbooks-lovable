import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEntityMutations } from "@/hooks/useEntityMutations";
import { UserPlus } from "lucide-react";
import { AuthorForm } from "./components/AuthorForm";
import { AuthorFormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

const AddAuthor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createAuthor } = useEntityMutations();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (values: AuthorFormValues) => {
    try {
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create an author",
          variant: "destructive",
        });
        return;
      }

      let photoPath = "";

      if (values.photo instanceof File) {
        const fileExt = values.photo.name.split('.').pop();
        const fileName = `authors/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('books')
          .upload(fileName, values.photo);

        if (uploadError) throw uploadError;
        photoPath = fileName;
      }

      // Clean up values before sending to API
      const cleanedValues = {
        ...values,
        name: values.name.trim(),
        photo: photoPath || undefined,
        date_of_birth: values.date_of_birth || null,
        website: values.website || null,
        facebook_url: values.facebook_url || null,
        twitter_url: values.twitter_url || null,
        instagram_url: values.instagram_url || null,
      };

      await createAuthor.mutateAsync(cleanedValues);

      toast({
        title: "Success",
        description: `Author "${values.name}" has been created successfully.`,
      });
      navigate("/books/authors");
    } catch (error: any) {
      console.error("Error creating author:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create author. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              Please log in to create an author.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Add New Author
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AuthorForm 
            onSubmit={onSubmit}
            isSubmitting={createAuthor.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAuthor;