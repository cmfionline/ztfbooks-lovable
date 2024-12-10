import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  socialMediaUrl: z.string().url().optional().or(z.literal("")),
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
      const { data: publisher, error } = await supabase
        .from("publishers")
        .insert({
          name: values.name,
          address: values.address || null,
          email: values.email || null,
          phone: values.phone || null,
          city: values.city || null,
          country: values.country || null,
          postcode: values.postcode || null,
          website: values.website || null,
          social_media_url: values.socialMediaUrl || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Publisher has been created successfully",
      });

      navigate("/books/publishers");
    } catch (error) {
      console.error("Error creating publisher:", error);
      toast({
        title: "Error",
        description: "Failed to create publisher. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Add New Publisher</CardTitle>
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
                        type="tel"
                        className="border-purple-light focus:border-purple focus:ring-purple"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="min-h-[80px] border-purple-light focus:border-purple focus:ring-purple"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                name="socialMediaUrl"
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

              <Button 
                type="submit"
                className="w-full bg-purple hover:bg-purple/90 text-white"
              >
                Create Publisher
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPublisher;