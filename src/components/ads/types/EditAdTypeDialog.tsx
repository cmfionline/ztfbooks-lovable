import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { AdTypeForm } from "./AdTypeForm";
import { adTypeSchema, type AdTypeFormValues } from "./schema";
import type { AdType } from "./AdTypesList";

interface EditAdTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adType: AdType | null;
  onSuccess: () => void;
}

export const EditAdTypeDialog = ({ 
  open, 
  onOpenChange,
  adType,
  onSuccess,
}: EditAdTypeDialogProps) => {
  const form = useForm<AdTypeFormValues>({
    resolver: zodResolver(adTypeSchema),
    values: adType ? {
      name: adType.name,
      type: adType.type,
      description: adType.description || "",
      status: adType.status,
    } : undefined,
  });

  const onSubmit = async (values: AdTypeFormValues) => {
    if (!adType) return;

    const { error } = await supabase
      .from('ad_types')
      .update(values)
      .eq('id', adType.id);

    if (error) {
      toast({
        title: "Error updating ad type",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Ad type updated successfully",
    });

    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Ad Type</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AdTypeForm control={form.control} />
            <Button type="submit">Update Ad Type</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};