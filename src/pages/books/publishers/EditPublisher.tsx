import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PublisherBasicInfo } from "./components/PublisherBasicInfo";
import { PublisherAddress } from "./components/PublisherAddress";
import { PublisherOnline } from "./components/PublisherOnline";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
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

const EditPublisher = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postcode: "",
      website: "",
      social_media_url: "",
    },
  });

  const { data: publisher, isLoading } = useQuery({
    queryKey: ["publisher", id],
    queryFn: async () => {
      if (!id) throw new Error("Publisher ID is required");

      const { data, error } = await supabase
        .from("publishers")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Publisher not found");

      // If there's a photo, get its public URL
      if (data.photo) {
        const { data: { publicUrl } } = supabase.storage
          .from('books')
          .getPublicUrl(data.photo);
        data.photoUrl = publicUrl;
      }

      return data;
    },
  });

  useEffect(() => {
    if (publisher) {
      form.reset({
        name: publisher.name || "",
        email: publisher.email || "",
        phone: publisher.phone || "",
        address: publisher.address || "",
        city: publisher.city || "",
        country: publisher.country || "",
        postcode: publisher.postcode || "",
        website: publisher.website || "",
        social_media_url: publisher.social_media_url || "",
        photo: publisher.photoUrl || undefined,
      });
    }
  }, [publisher, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id) throw new Error("Publisher ID is required");

      let photoPath = publisher?.photo;

      // Handle photo upload if a new file is selected
      if (values.photo instanceof File) {
        const fileExt = values.photo.name.split('.').pop();
        const fileName = `publishers/${id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('books')
          .upload(fileName, values.photo, {
            upsert: true
          });

        if (uploadError) throw uploadError;
        photoPath = fileName;
      }

      const { error } = await supabase
        .from("publishers")
        .update({
          name: values.name,
          email: values.email || null,
          phone: values.phone || null,
          address: values.address || null,
          city: values.city || null,
          country: values.country || null,
          postcode: values.postcode || null,
          website: values.website || null,
          social_media_url: values.social_media_url || null,
          photo: photoPath,
        })
        .eq("id", id);

      if (error) throw error;

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Edit Publisher
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      "Update Publisher"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPublisher;