import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useEntityMutations } from "@/hooks/useEntityMutations";
import { UserPlus, Loader2 } from "lucide-react";
import { BasicInfoFields } from "./components/BasicInfoFields";
import { SocialMediaFields } from "./components/SocialMediaFields";
import { authorFormSchema, type AuthorFormValues } from "./schema";

const AddAuthor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createAuthor } = useEntityMutations();

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: "",
      nationality: "",
      photo: "",
      bio: "",
      website: "",
      facebook_url: "",
      twitter_url: "",
      instagram_url: "",
      date_of_birth: "",
    },
  });

  const onSubmit = async (values: AuthorFormValues) => {
    try {
      await createAuthor.mutateAsync(values);
      toast({
        title: "Success",
        description: `Author "${values.name}" has been created successfully.`,
      });
      navigate("/books/authors");
    } catch (error) {
      console.error("Error creating author:", error);
      toast({
        title: "Error",
        description: "Failed to create author. Please try again.",
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BasicInfoFields form={form} />
              <SocialMediaFields form={form} />
              
              <div className="flex gap-4 pt-2">
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
                  disabled={createAuthor.isPending}
                >
                  {createAuthor.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Author"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAuthor;