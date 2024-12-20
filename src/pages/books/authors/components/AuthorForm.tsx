import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInfoFields } from "./BasicInfoFields";
import { SocialMediaFields } from "./SocialMediaFields";
import { authorFormSchema, AuthorFormValues } from "../schema";
import { Author } from "../types";
import { useNavigate } from "react-router-dom";

interface AuthorFormProps {
  author?: Author;
  onSubmit: (values: AuthorFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export const AuthorForm = ({ author, onSubmit, isSubmitting = false }: AuthorFormProps) => {
  const navigate = useNavigate();
  
  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: author?.name || "",
      designation: author?.designation || "",
      education: author?.education || "",
      nationality: author?.nationality || "",
      date_of_birth: author?.date_of_birth || "",
      bio: author?.bio || "",
      mobile: author?.mobile || "",
      address: author?.address || "",
      description: author?.description || "",
      website: author?.website || "",
      facebook_url: author?.facebook_url || "",
      twitter_url: author?.twitter_url || "",
      instagram_url: author?.instagram_url || "",
      photo: author?.photoUrl || undefined,
    },
  });

  return (
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