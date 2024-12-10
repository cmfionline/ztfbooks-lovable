import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { PlusCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useBookFormData } from "@/hooks/useBookFormData";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  languageId: z.string().optional(),
  image: z.any().optional(),
});

const AddSeries = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { languages = [], isLoading } = useBookFormData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let imagePath = null;

      if (values.image) {
        const imageFile = values.image[0];
        const { data: imageData, error: imageError } = await supabase.storage
          .from("books")
          .upload(`series/${Date.now()}-${imageFile.name}`, imageFile);
        
        if (imageError) throw imageError;
        imagePath = imageData.path;
      }

      const { data: series, error: seriesError } = await supabase
        .from("series")
        .insert({
          name: values.name,
          description: values.description,
          language_id: values.languageId,
          image: imagePath,
        })
        .select()
        .single();

      if (seriesError) throw seriesError;

      toast({
        title: "Success",
        description: "Series has been created successfully",
      });

      navigate("/books/series");
    } catch (error) {
      console.error("Error creating series:", error);
      toast({
        title: "Error",
        description: "Failed to create series. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Add New Series</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-[100px] bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Add New Series</CardTitle>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="min-h-[120px] border-purple-light focus:border-purple focus:ring-purple"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languageId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-primary">Language</FormLabel>
                      <Link 
                        to="/books/languages/add"
                        className="text-sm text-purple hover:text-purple-dark flex items-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Language
                      </Link>
                    </div>
                    <FormControl>
                      <CreatableCombobox
                        value={field.value}
                        options={languages}
                        onChange={field.onChange}
                        onCreateOption={() => {}}
                        placeholder="Select a language"
                        className="border-purple-light focus:border-purple"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Series Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                        className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
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
                Create Series
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSeries;