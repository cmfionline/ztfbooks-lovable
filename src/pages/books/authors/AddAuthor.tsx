import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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

      await createAuthor.mutateAsync({
        ...values,
        name: values.name.trim(),
        photo: photoPath || undefined,
      });

      toast({
        title: "Success",
        description: `Author "${values.name}" has been created successfully.`,
      });
      navigate("/books/authors");
    } catch (error) {
      throw error;
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