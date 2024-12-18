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
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { SeriesFormFields } from "./components/SeriesFormFields";
import { EditBookError } from "../components/EditBookError";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  languageId: z.string().optional(),
  image: z.any().optional(),
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
      languageId: undefined,
      image: undefined,
    },
  });

  const { data: series, isLoading, error } = useQuery({
    queryKey: ["series", id],
    queryFn: async () => {
      if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
        throw new Error("Invalid series ID format");
      }

      const { data, error } = await supabase
        .from("series")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching series:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Series not found");
      }

      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (series) {
      form.reset({
        name: series.name,
        description: series.description || "",
        languageId: series.language_id || undefined,
        image: series.image,
      });
    }
  }, [series, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
        throw new Error("Invalid series ID format");
      }

      let imagePath = series?.image;

      if (values.image instanceof File) {
        const fileExt = values.image.name.split('.').pop();
        const fileName = `${id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('books')
          .upload(`series/${fileName}`, values.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('books')
          .getPublicUrl(`series/${fileName}`);

        imagePath = publicUrl;
      }

      const { error } = await supabase
        .from("series")
        .update({
          name: values.name,
          description: values.description,
          language_id: values.languageId,
          image: imagePath,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Series has been updated successfully",
      });

      navigate("/books/series");
    } catch (error: any) {
      console.error("Error updating series:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update series",
      });
    }
  };

  if (error) {
    return <EditBookError error={error} />;
  }

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
            <CardTitle className="text-2xl font-bold text-primary">
              Edit Series
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <SeriesFormFields control={form.control} />

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
    </div>
  );
};

export default EditSeries;