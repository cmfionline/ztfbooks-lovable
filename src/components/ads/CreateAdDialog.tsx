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
import { adSchema, type AdFormValues } from "./schema";

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
      title: "Ad created",
      description: "The ad has been successfully created.",
    });

    queryClient.invalidateQueries({ queryKey: ['ads'] });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Advertisement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              <BasicInfoFields control={form.control} />
              <CreativeFields control={form.control} />
            </div>
            <SchedulingFields control={form.control} />
            <Button type="submit">Create Ad</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdDialog;