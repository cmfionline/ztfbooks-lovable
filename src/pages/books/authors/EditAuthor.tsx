import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s\-'.]+$/,
      "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
    )
    .transform((val) => val.trim()),
});

type FormValues = z.infer<typeof formSchema>;

const EditAuthor = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data: author, isLoading } = useQuery({
    queryKey: ["author", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (author) {
      form.reset({
        name: author.name,
      });
    }
  }, [author, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase
        .from("authors")
        .update({ name: values.name })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Author "${values.name}" has been updated successfully.`,
      });
      navigate("/books/authors");
    } catch (error) {
      console.error("Error updating author:", error);
      toast({
        title: "Error",
        description: "Failed to update author. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
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
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <User className="w-6 h-6" />
            Edit Author
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
                        placeholder="Enter author's name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/books/authors")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple hover:bg-purple/90 text-white"
                >
                  Update Author
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAuthor;