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
    const { error } = await supabase
      .from('ads')
      .insert([values]);

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Basic Information</h3>
                <BasicInfoFields control={form.control} />
              </div>

              <div>
                <h3 className="text-lg font-medium">Creative Content</h3>
                <CreativeFields control={form.control} />
              </div>

              <div>
                <h3 className="text-lg font-medium">Campaign Schedule</h3>
                <SchedulingFields control={form.control} />
              </div>
            </div>

            <Button type="submit">Create Ad</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdDialog;