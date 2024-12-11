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
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { addDays } from "date-fns";

interface AdFormProps {
  onSuccess: () => void;
}

export const AdForm = ({ onSuccess }: AdFormProps) => {
  const tomorrow = addDays(new Date(), 1);
  const nextWeek = addDays(new Date(), 7);

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: "",
      type: "banner",
      placement: "home",
      content: "",
      cta_text: "Learn More",
      is_stackable: false,
      discount_type: "percentage",
      start_date: tomorrow.toISOString().split('T')[0],
      end_date: nextWeek.toISOString().split('T')[0],
      discount_start_date: tomorrow.toISOString().split('T')[0],
      discount_end_date: nextWeek.toISOString().split('T')[0],
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
        
        const { error: uploadError } = await supabase.storage
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

      // Format dates for database
      const formattedStartDate = values.discount_start_date ? new Date(values.discount_start_date).toISOString() : null;
      const formattedEndDate = values.discount_end_date ? new Date(values.discount_end_date).toISOString() : null;

      const { error } = await supabase
        .from('ads')
        .insert([{
          ...values,
          image_url,
          video_url,
          discount_start_date: formattedStartDate,
          discount_end_date: formattedEndDate,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="grid gap-6 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <BasicInfoFields control={form.control} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Schedule</h3>
                  <SchedulingFields control={form.control} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Creative Content</h3>
                  <CreativeFields control={form.control} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Discount Settings</h3>
                  <DiscountFields control={form.control} watch={form.watch} />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="min-w-[120px]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Ad'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};