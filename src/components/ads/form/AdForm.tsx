import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { BasicInfoFields } from "./BasicInfoFields";
import { CreativeFields } from "./CreativeFields";
import { SchedulingFields } from "./SchedulingFields";
import { DiscountFields } from "./DiscountFields";
import { adSchema, type AdFormValues } from "../schema";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

interface AdFormProps {
  ad?: AdFormValues & { id: string; image_url?: string; video_url?: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AdForm = ({ ad, onSuccess, onCancel }: AdFormProps) => {
  const queryClient = useQueryClient();
  
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: ad?.name || '',
      type: ad?.type || 'banner',
      placement: ad?.placement || 'home',
      content: ad?.content || '',
      cta_text: ad?.cta_text || 'Learn More',
      start_date: ad?.start_date || '',
      end_date: ad?.end_date || '',
      discount_strategy_id: ad?.discount_strategy_id || undefined,
      image_url: ad?.image_url || '',
      video_url: ad?.video_url || '',
    },
  });

  const onSubmit = async (values: AdFormValues) => {
    try {
      let image_url = ad?.image_url;
      let video_url = ad?.video_url;

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

      // Remove file fields before sending to Supabase
      const { image_file, video_file, ...adData } = values;

      if (ad?.id) {
        const { error } = await supabase
          .from('ads')
          .update({
            ...adData,
            image_url,
            video_url,
            start_date: values.start_date,  // Explicitly include start_date
            end_date: values.end_date,      // Explicitly include end_date
          })
          .eq('id', ad.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Ad updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('ads')
          .insert([{
            ...adData,
            image_url,
            video_url,
            start_date: values.start_date,  // Explicitly include start_date
            end_date: values.end_date,      // Explicitly include end_date
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Ad created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['ads'] });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ad ? 'Edit Advertisement' : 'Create Advertisement'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              <BasicInfoFields control={form.control} />
              <CreativeFields control={form.control} />
            </div>
            <SchedulingFields control={form.control} />
            <DiscountFields control={form.control} />
            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit"
                className="bg-purple hover:bg-purple/90 text-white"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {ad ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  ad ? 'Update Ad' : 'Create Ad'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};