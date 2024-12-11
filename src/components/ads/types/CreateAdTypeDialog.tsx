import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { AdTypeForm } from "./AdTypeForm";
import { adTypeSchema, type AdTypeFormValues } from "./schema";

interface CreateAdTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateAdTypeDialog = ({ 
  open, 
  onOpenChange,
  onSuccess,
}: CreateAdTypeDialogProps) => {
  const form = useForm<AdTypeFormValues>({
    resolver: zodResolver(adTypeSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      status: "active",
    },
  });

  const onSubmit = async (values: AdTypeFormValues) => {
    const { error } = await supabase
      .from('ad_types')
      .insert([values]);

    if (error) {
      toast({
        title: "Error creating ad type",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Ad type created successfully",
    });

    onSuccess();
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Ad Type</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AdTypeForm control={form.control} />
            <Button type="submit">Create Ad Type</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};