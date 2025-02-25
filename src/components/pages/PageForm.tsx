import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PageContentForm } from "./form/PageContentForm";
import { PageFormValues, Page, pageFormSchema } from "./types";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface PageFormProps {
  initialData?: Page;
  isEditing?: boolean;
}

const PageForm = ({ initialData, isEditing }: PageFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      status: initialData?.status || "active",
      order_index: initialData?.order_index || 0,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: PageFormValues) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.user.id)
        .single();

      if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to perform this action",
          variant: "destructive",
        });
        return;
      }

      if (isEditing && initialData) {
        const { error } = await supabase
          .from("pages")
          .update({
            title: values.title,
            content: values.content,
            status: values.status,
            order_index: values.order_index,
          })
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Page updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("pages")
          .insert([{
            title: values.title,
            content: values.content,
            status: values.status,
            order_index: values.order_index,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Page created successfully",
        });
      }

      navigate("/pages");
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <ErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PageContentForm control={form.control} />
          
          <Button 
            type="submit"
            className="w-full bg-purple hover:bg-purple/90"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? "Update Page" : "Create Page"}
          </Button>
        </form>
      </Form>
    </ErrorBoundary>
  );
};

export default PageForm;