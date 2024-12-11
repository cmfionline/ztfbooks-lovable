import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { CreativeFields } from "./form/CreativeFields";
import { SchedulingFields } from "./form/SchedulingFields";
import { DiscountFields } from "./form/DiscountFields";
import { adSchema, type AdFormValues } from "./schema";

interface AdFormProps {
  onSuccess: () => void;
}

export const AdForm = ({ onSuccess }: AdFormProps) => {
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: "",
      type: "banner",
      placement: "home",
      content: "",
      cta_text: "Learn More",
    },
  });

  const onSubmit = async (values: AdFormValues) => {
    try {
      let image_url = null;
      let video_url = null;

      if (values.image_file) {
        const file = values.image_file;
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('ads')
          .upload(filePath, file);

        if (uploadError) {
          toast({
            title: "Error uploading image",
            description: uploadError.message,
            variant: "destructive",
          });
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('ads')
          .getPublicUrl(filePath);

        image_url = publicUrl;
      }

      if (values.video_file) {
        const file = values.video_file;
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('ads')
          .upload(filePath, file);

        if (uploadError) {
          toast({
            title: "Error uploading video",
            description: uploadError.message,
            variant: "destructive",
          });
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('ads')
          .getPublicUrl(filePath);

        video_url = publicUrl;
      }

      const { error } = await supabase
        .from('ads')
        .insert([{
          ...values,
          image_url,
          video_url,
        }]);

      if (error) {
        toast({
          title: "Error creating ad",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "The ad has been successfully created.",
        variant: "default",
      });

      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error creating ad:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-background p-6 rounded-lg shadow-sm border border-border">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <BasicInfoFields control={form.control} />
            <SchedulingFields control={form.control} />
          </div>
          <div className="space-y-6">
            <CreativeFields control={form.control} />
            <DiscountFields control={form.control} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            type="submit"
            className="bg-purple hover:bg-purple/90 text-white min-w-[120px] focus:ring-2 focus:ring-purple/50"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Ad"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
