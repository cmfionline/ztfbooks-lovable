import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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
      const { data, error } = await supabase
        .from("publishers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching publisher",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
  });

  useEffect(() => {
    if (publisher) {
      form.reset({
        name: publisher.name,
        email: publisher.email || "",
        phone: publisher.phone || "",
        address: publisher.address || "",
        city: publisher.city || "",
        country: publisher.country || "",
        postcode: publisher.postcode || "",
        website: publisher.website || "",
        social_media_url: publisher.social_media_url || "",
      });
    }
  }, [publisher, form]);

  const onSubmit = async (values: FormValues) => {
    try {
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
        description: error.message || "Failed to update publisher. Please try again.",
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="border-purple-light focus:border-purple focus:ring-purple"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            className="border-purple-light focus:border-purple focus:ring-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Phone</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="border-purple-light focus:border-purple focus:ring-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="border-purple-light focus:border-purple focus:ring-purple"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">City</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="border-purple-light focus:border-purple focus:ring-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Country</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="border-purple-light focus:border-purple focus:ring-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Postcode</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="border-purple-light focus:border-purple focus:ring-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Website</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="url"
                            className="border-purple-light focus:border-purple focus:ring-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="social_media_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Social Media URL</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="url"
                            className="border-purple-light focus:border-purple focus:ring-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPublisher;