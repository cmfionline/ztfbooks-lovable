import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ButtonFields } from "./form/ButtonFields";
import { ConfigFields } from "./form/ConfigFields";
import { contentBlockSchema, ContentBlockFormProps, ContentBlockFormValues } from "./types";

export const ContentBlockForm = ({ initialData, onSuccess }: ContentBlockFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile && ["admin", "super_admin"].includes(profile.role)) {
          setIsAdmin(true);
          return;
        }
      }
      
      toast({
        title: "Access denied",
        description: "You need admin privileges to manage content blocks",
        variant: "destructive",
      });
      navigate("/");
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const form = useForm<ContentBlockFormValues>({
    resolver: zodResolver(contentBlockSchema),
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      button_text: "",
      button_link: "",
      order_index: 0,
      is_active: true,
    },
  });

  const onSubmit = async (values: ContentBlockFormValues) => {
    try {
      if (!isAdmin) {
        toast({
          title: "Access denied",
          description: "You need admin privileges to manage content blocks",
          variant: "destructive",
        });
        return;
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from("content_blocks")
          .update(values)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Content block updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("content_blocks")
          .insert([values]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Content block created successfully",
        });
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <BasicInfoFields form={form} />
          <ButtonFields form={form} />
          <ConfigFields form={form} />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {initialData ? "Update" : "Create"} Content Block
        </Button>
      </form>
    </Form>
  );
};