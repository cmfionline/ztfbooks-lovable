import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  code: z.string().min(2, "Language code is required").max(5, "Language code must be 5 characters or less"),
});

const AddLanguage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: language, error } = await supabase
        .from("languages")
        .insert({
          name: values.name,
          code: values.code,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Language has been created successfully",
      });

      navigate("/books/languages");
    } catch (error) {
      console.error("Error creating language:", error);
      toast({
        title: "Error",
        description: "Failed to create language. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Add New Language</CardTitle>
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Language Code (e.g., en, fr, es)</FormLabel>
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

              <Button 
                type="submit"
                className="w-full bg-purple hover:bg-purple/90 text-white"
              >
                Create Language
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddLanguage;