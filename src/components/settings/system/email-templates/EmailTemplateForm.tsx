import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const templateFormSchema = z.object({
  name: z.string().min(2, "Template name must be at least 2 characters"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
});

type EmailTemplateForm = z.infer<typeof templateFormSchema>;

interface EmailTemplateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmailTemplateForm = ({ onSuccess, onCancel }: EmailTemplateFormProps) => {
  const { toast } = useToast();
  const form = useForm<EmailTemplateForm>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      subject: "",
      body: "",
    },
  });

  const handleSubmit = async (values: EmailTemplateForm) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Error",
          description: "You must be logged in to create templates",
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
          title: "Error",
          description: "You don't have permission to create templates",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("email_templates")
        .insert({
          name: values.name,
          subject: values.subject,
          body: values.body,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email template created successfully",
        className: "bg-green-50 border-green-200",
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create email template",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 pt-2">
          <Button 
            type="submit" 
            className="flex-1 bg-purple hover:bg-purple-dark text-white"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Create Template
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};