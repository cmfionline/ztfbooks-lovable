import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PublisherBasicInfo } from "./PublisherBasicInfo";
import { PublisherAddress } from "./PublisherAddress";
import { PublisherOnline } from "./PublisherOnline";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255, "Name must be less than 255 characters"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  social_media_url: z.string().url().optional().or(z.literal("")),
  photo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditPublisherFormProps {
  initialData?: any;
  id: string;
}

export const EditPublisherForm = ({ initialData, id }: EditPublisherFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      country: initialData?.country || "",
      postcode: initialData?.postcode || "",
      website: initialData?.website || "",
      social_media_url: initialData?.social_media_url || "",
      photo: initialData?.photoUrl || undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Updating publisher with data:", values);
      
      let photoPath = initialData?.photo;

      if (values.photo instanceof File) {
        const fileExt = values.photo.name.split('.').pop();
        const fileName = `publishers/${id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('books')
          .upload(fileName, values.photo, {
            upsert: true
          });

        if (uploadError) {
          console.error("Error uploading photo:", uploadError);
          throw uploadError;
        }
        
        photoPath = fileName;
      }

      const { error } = await supabase
        .from("publishers")
        .update({
          name: values.name.trim(),
          email: values.email?.trim() || null,
          phone: values.phone?.trim() || null,
          address: values.address?.trim() || null,
          city: values.city?.trim() || null,
          country: values.country?.trim() || null,
          postcode: values.postcode?.trim() || null,
          website: values.website?.trim() || null,
          social_media_url: values.social_media_url?.trim() || null,
          photo: photoPath,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating publisher:", error);
        throw error;
      }

      console.log("Publisher updated successfully");

      toast({
        title: "Success",
        description: "Publisher has been updated successfully",
      });

      navigate("/books/publishers");
    } catch (error: any) {
      console.error("Error updating publisher:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update publisher",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PublisherBasicInfo control={form.control} />
        <PublisherAddress control={form.control} />
        <PublisherOnline control={form.control} />
        
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/books/publishers")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-purple hover:bg-purple/90 text-white"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Update Publisher"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};