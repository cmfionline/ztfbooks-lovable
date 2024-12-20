import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { HeroFormFields } from "./HeroFormFields";
import { Loader2 } from "lucide-react";

const heroFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  primary_button_text: z.string().min(1, "Primary button text is required"),
  secondary_button_text: z.string().min(1, "Secondary button text is required"),
  primary_button_link: z.string().min(1, "Primary button link is required"),
  secondary_button_link: z.string().min(1, "Secondary button link is required"),
  app_store_link: z.string().optional(),
  play_store_link: z.string().optional(),
  hero_image: z.any().optional(),
  is_active: z.boolean().optional(),
});

type HeroFormValues = z.infer<typeof heroFormSchema>;

interface HeroFormProps {
  initialData?: HeroFormValues;
  onSubmit: () => void;
  onCancel: () => void;
}

export const HeroForm = ({ initialData, onSubmit, onCancel }: HeroFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      primary_button_text: "",
      secondary_button_text: "",
      primary_button_link: "",
      secondary_button_link: "",
      app_store_link: "",
      play_store_link: "",
      hero_image: "",
      is_active: true,
    },
  });

  const handleSubmit = async (values: HeroFormValues) => {
    try {
      let heroImageUrl = values.hero_image;

      // Handle file upload if a new file is selected
      if (values.hero_image instanceof File) {
        const file = values.hero_image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('ads')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('ads')
          .getPublicUrl(fileName);

        heroImageUrl = publicUrl;
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from("hero_sections")
          .update({
            ...values,
            hero_image: heroImageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("hero_sections")
          .insert([{
            ...values,
            hero_image: heroImageUrl,
          }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Hero section ${initialData ? "updated" : "created"} successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ["hero-sections"] });
      onSubmit();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} hero section.`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <HeroFormFields 
          control={form.control}
          heroImage={typeof initialData?.hero_image === 'string' ? initialData.hero_image : undefined}
        />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="bg-purple hover:bg-purple/90 text-white"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialData ? "Update Changes" : "Create Section"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};