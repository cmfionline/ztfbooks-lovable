import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const heroFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  primary_button_text: z.string().min(1, "Primary button text is required"),
  secondary_button_text: z.string().min(1, "Secondary button text is required"),
  primary_button_link: z.string().min(1, "Primary button link is required"),
  secondary_button_link: z.string().min(1, "Secondary button link is required"),
  app_store_link: z.string().optional(),
  play_store_link: z.string().optional(),
  hero_image: z.string().optional(),
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
    },
  });

  const handleSubmit = async (values: HeroFormValues) => {
    try {
      if (initialData) {
        const { error } = await supabase
          .from("hero_sections")
          .update(values)
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("hero_sections").insert([values]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Hero section ${initialData ? "updated" : "created"} successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ["hero-sections"] });
      onSubmit();
    } catch (error) {
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="primary_button_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Button Text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primary_button_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Button Link</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="secondary_button_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Button Text</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondary_button_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Button Link</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="app_store_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Store Link</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="play_store_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Play Store Link</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="hero_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Image URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};