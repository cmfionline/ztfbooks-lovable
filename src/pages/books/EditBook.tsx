import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Book } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BookForm, type BookFormValues } from "./components/BookForm";
import { useQuery } from "@tanstack/react-query";

const EditBook = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          languages (name),
          series (name),
          publishers (name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (values: BookFormValues) => {
    try {
      let coverImagePath = book?.cover_image;
      let epubFilePath = book?.epub_file;

      if (values.cover_image && values.cover_image !== book?.cover_image) {
        const { data: coverData, error: coverError } = await supabase.storage
          .from("books")
          .upload(`covers/${Date.now()}-${values.cover_image.name}`, values.cover_image);

        if (coverError) throw coverError;
        coverImagePath = coverData.path;
      }

      if (values.epub_file && values.epub_file !== book?.epub_file) {
        const { data: epubData, error: epubError } = await supabase.storage
          .from("books")
          .upload(`epubs/${Date.now()}-${values.epub_file.name}`, values.epub_file);

        if (epubError) throw epubError;
        epubFilePath = epubData.path;
      }

      const { error } = await supabase
        .from("books")
        .update({
          title: values.title,
          description: values.description,
          is_free: values.is_free,
          price: values.is_free ? 0 : values.price,
          series_id: values.series_id || null,
          author_id: values.author_id,
          publisher_id: values.publisher_id,
          tags: values.tags,
          language_id: values.language_id,
          cover_image: coverImagePath,
          epub_file: epubFilePath,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book has been updated successfully",
      });

      navigate("/books");
    } catch (error: any) {
      console.error("Error updating book:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update book. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Book className="w-6 h-6" />
              Edit Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookForm 
              onSubmit={handleSubmit} 
              onCancel={() => navigate("/books")} 
              initialValues={book}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditBook;