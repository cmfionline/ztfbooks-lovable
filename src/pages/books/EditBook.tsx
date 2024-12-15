import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Book } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BookForm } from "@/components/books/BookForm";
import type { BookFormValues } from "./schema";
import { useQuery } from "@tanstack/react-query";

const EditBook = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          languages (name),
          series (name),
          publishers (name),
          books_tags (tag_id)
        `)
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error("Book not found");
        }
        throw error;
      }

      // Transform the data to match our form values type
      const formData: Partial<BookFormValues> = {
        title: data.title,
        series_id: data.series_id,
        language_id: data.language_id,
        cover_image: data.cover_image,
        synopsis: data.synopsis,
        author_id: data.author_id,
        publisher_id: data.publisher_id,
        epub_file: data.epub_file,
        publication_date: data.publication_date ? new Date(data.publication_date) : undefined,
        page_count: data.page_count,
        is_free: data.is_free,
        price: data.price,
        tags: data.books_tags?.map(tag => tag.tag_id) || [],
      };

      return formData;
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
          synopsis: values.synopsis,
          is_free: values.is_free,
          price: values.is_free ? 0 : values.price,
          series_id: values.series_id || null,
          author_id: values.author_id,
          publisher_id: values.publisher_id || null,
          language_id: values.language_id,
          cover_image: coverImagePath,
          epub_file: epubFilePath,
          publication_date: values.publication_date?.toISOString().split('T')[0],
          page_count: values.page_count,
        })
        .eq("id", id);

      if (error) throw error;

      // Update book tags
      if (values.tags) {
        // First, remove all existing tags
        await supabase
          .from("books_tags")
          .delete()
          .eq("book_id", id);

        // Then insert new tags
        if (values.tags.length > 0) {
          const tagRows = values.tags.map(tagId => ({
            book_id: id,
            tag_id: tagId
          }));

          const { error: tagsError } = await supabase
            .from("books_tags")
            .insert(tagRows);

          if (tagsError) throw tagsError;
        }
      }

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

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-destructive">
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Book className="w-6 h-6" />
                Loading...
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
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
              initialData={book}
              submitLabel="Update Book"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditBook;