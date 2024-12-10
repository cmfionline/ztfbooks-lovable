import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { SeriesBasicInfo } from "./SeriesBasicInfo";
import { SeriesLanguage } from "./SeriesLanguage";
import { SeriesImage } from "./SeriesImage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  languageId: z.string().optional(),
  image: z.any().optional(),
});

export const SeriesForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SeriesBasicInfo control={form.control} />
        <SeriesLanguage control={form.control} />
        <SeriesImage control={form.control} />
        <Button 
          type="submit"
          className="w-full bg-purple hover:bg-purple/90 text-white"
        >
          Create Series
        </Button>
      </form>
    </Form>
  );
};