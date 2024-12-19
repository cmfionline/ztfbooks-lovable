import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { CreativeFields } from "./form/CreativeFields";
import { SchedulingFields } from "./form/SchedulingFields";
import { DiscountFields } from "./form/DiscountFields";
import { adSchema, type AdFormValues } from "./schema";
import { Loader2 } from "lucide-react";

interface EditAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: AdFormValues & { id: string; image_url?: string; video_url?: string };
}

const EditAdDialog = ({ open, onOpenChange, ad }: EditAdDialogProps) => {
  const queryClient = useQueryClient();
  
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: ad.name,
      type: ad.type,
      placement: ad.placement,
      content: ad.content,
      cta_text: ad.cta_text,
      start_date: ad.start_date,
      end_date: ad.end_date,
      discount_strategy_id: ad.discount_strategy_id,
      image_url: ad.image_url,
      video_url: ad.video_url,
    },
  });

  const onSubmit = async (values: AdFormValues) => {
    try {
      let image_url = ad.image_url;
      let video_url = ad.video_url;

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

      const { error } = await supabase
        .from('ads')
        .update({
          ...adData,
          image_url,
          video_url,
        })
        .eq('id', ad.id);

      if (error) {
        toast({
          title: "Error updating ad",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "The ad has been successfully updated.",
      });

      queryClient.invalidateQueries({ queryKey: ['ads'] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error updating ad:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Edit Advertisement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              <BasicInfoFields control={form.control} />
              <CreativeFields control={form.control} />
            </div>
            <SchedulingFields control={form.control} />
            <DiscountFields control={form.control} />
            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="bg-purple hover:bg-purple/90 text-white min-w-[120px] focus:ring-2 focus:ring-purple/50"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Ad'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdDialog;