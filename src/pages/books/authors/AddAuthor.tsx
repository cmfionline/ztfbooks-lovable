import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEntityMutations } from "@/hooks/useEntityMutations";
import { UserPlus } from "lucide-react";
import { AuthorForm } from "./components/AuthorForm";
import { AuthorFormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";

const AddAuthor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createAuthor } = useEntityMutations();

  const onSubmit = async (values: AuthorFormValues) => {
    try {
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