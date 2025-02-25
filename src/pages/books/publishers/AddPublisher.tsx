import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { PublisherBasicInfo } from "./components/PublisherBasicInfo";
import { PublisherAddress } from "./components/PublisherAddress";
import { PublisherOnline } from "./components/PublisherOnline";
import { Loader2, Building2 } from "lucide-react";

const formSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters"),
  address: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  socialMediaUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

const AddPublisher = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      postcode: "",
      website: "",
      socialMediaUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting publisher data:", values);
      
      const { data: publisher, error } = await supabase
        .from("publishers")
        .insert({
          name: values.name.trim(),
          address: values.address?.trim() || null,
          email: values.email?.trim() || null,
          phone: values.phone?.trim() || null,
          city: values.city?.trim() || null,
          country: values.country?.trim() || null,
          postcode: values.postcode?.trim() || null,
          website: values.website?.trim() || null,
          social_media_url: values.socialMediaUrl?.trim() || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating publisher:", error);
        throw error;
      }

      if (!publisher) {
        throw new Error("Failed to create publisher - no data returned");
      }

      console.log("Publisher created successfully:", publisher);

      toast({
        title: "Success",
        description: "Publisher has been created successfully",
      });

      navigate("/books/publishers");
    } catch (error: any) {
      console.error("Error creating publisher:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create publisher",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Add New Publisher
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
                  className="flex-1 border-purple-light hover:bg-purple-light/10"
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
                      Creating...
                    </div>
                  ) : (
                    "Create Publisher"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPublisher;