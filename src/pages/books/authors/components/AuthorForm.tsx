import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { SocialMediaFields } from "./fields/SocialMediaFields";
import { authorFormSchema, type AuthorFormValues } from "../schema";
import { Author } from "../types";
import { supabase } from "@/integrations/supabase/client";

interface AuthorFormProps {
  author?: Author;
  onSubmit: (values: AuthorFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export const AuthorForm = ({ author, onSubmit, isSubmitting = false }: AuthorFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: author?.name || "",
      nationality: author?.nationality || "",
      date_of_birth: author?.date_of_birth || "",
      bio: author?.bio || "",
      mobile: author?.mobile || "",
      address: author?.address || "",
      website: author?.website || "",
      facebook_url: author?.facebook_url || "",
      twitter_url: author?.twitter_url || "",
      instagram_url: author?.instagram_url || "",
      photo: author?.photoUrl || undefined,
    },
  });

  const handleSubmit = async (values: AuthorFormValues) => {
    try {
      await onSubmit(values);
    } catch (error: any) {
      console.error("Error submitting author:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save author. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields control={form.control} currentPhoto={author?.photoUrl} />
        <SocialMediaFields control={form.control} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/books/authors")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-purple hover:bg-purple/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {author ? "Updating..." : "Creating..."}
              </>
            ) : (
              author ? "Update Author" : "Create Author"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};