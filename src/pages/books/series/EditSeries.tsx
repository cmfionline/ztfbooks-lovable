import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Library, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { SeriesBasicInfo } from "./components/SeriesBasicInfo";
import { SeriesLanguage } from "./components/SeriesLanguage";
import { SeriesImage } from "./components/SeriesImage";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  languageId: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const EditSeries = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      languageId: "",
      image: "",
    },
  });

  const { data: series, isLoading } = useQuery({
    queryKey: ["series", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("series")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (series) {
      form.reset({
        name: series.name,
        description: series.description || "",
        languageId: series.language_id || "",
        image: series.image || "",
      });
    }
  }, [series, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase
        .from("series")
        .update({
          name: values.name,
          description: values.description,
          language_id: values.languageId,
          image: values.image,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Series "${values.name}" has been updated successfully.`,
      });
      navigate("/books/series");
    } catch (error) {
      console.error("Error updating series:", error);
      toast({
        title: "Error",
        description: "Failed to update series. Please try again.",
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
            <Library className="w-6 h-6" />
            Edit Series
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <SeriesBasicInfo control={form.control} />
              <SeriesLanguage control={form.control} />
              <SeriesImage control={form.control} />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/books/series")}
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
                    "Update Series"
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

export default EditSeries;