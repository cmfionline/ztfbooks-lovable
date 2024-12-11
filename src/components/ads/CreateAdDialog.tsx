import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { adSchema, type AdFormValues } from "./schema";
import { Loader2 } from "lucide-react";

interface CreateAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateAdDialog = ({ open, onOpenChange }: CreateAdDialogProps) => {
  const queryClient = useQueryClient();
  
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
      });

      queryClient.invalidateQueries({ queryKey: ['ads'] });
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Create New Advertisement</DialogTitle>
          <DialogDescription className="text-gray-500">
            Fill in the details below to create a new advertisement campaign.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              <BasicInfoFields control={form.control} />
              <CreativeFields control={form.control} />
            </div>
            <SchedulingFields control={form.control} />
            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="bg-purple hover:bg-purple/90 text-white min-w-[120px] focus:ring-2 focus:ring-purple/50"
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdDialog;