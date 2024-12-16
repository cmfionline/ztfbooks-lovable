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
          languages (name, code),
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

      // Transform snake_case to camelCase for form values
      const formData: Partial<BookFormValues> = {
        title: data.title,
        seriesId: data.series_id,
        languageId: data.language_id,
        coverImage: data.cover_image,
        synopsis: data.synopsis,
        authorId: data.author_id,
        publisherId: data.publisher_id,
        epubFile: data.epub_file,
        publicationDate: data.publication_date ? new Date(data.publication_date) : undefined,
        pageCount: data.page_count,
        isFree: data.is_free,
        price: data.price,
        tags: data.books_tags?.map(tag => tag.tag_id) || [],
      };

      return formData;
    },
  });

  const handleSubmit = async (values: BookFormValues) => {
    try {
      let coverImagePath = book?.coverImage;
      let epubFilePath = book?.epubFile;

      if (values.coverImage && values.coverImage !== book?.coverImage) {
        const { data: coverData, error: coverError } = await supabase.storage
          .from("books")
          .upload(`covers/${Date.now()}-${values.coverImage.name}`, values.coverImage);

        if (coverError) throw coverError;
        coverImagePath = coverData.path;
      }

      if (values.epubFile && values.epubFile !== book?.epubFile) {
        const { data: epubData, error: epubError } = await supabase.storage
          .from("books")
          .upload(`epubs/${Date.now()}-${values.epubFile.name}`, values.epubFile);

        if (epubError) throw epubError;
        epubFilePath = epubData.path;
      }

      // Transform camelCase back to snake_case for database
      const { error } = await supabase
        .from("books")
        .update({
          title: values.title,
          synopsis: values.synopsis,
          is_free: values.isFree,
          price: values.isFree ? 0 : values.price,
          series_id: values.seriesId || null,
          author_id: values.authorId,
          publisher_id: values.publisherId || null,
          language_id: values.languageId,
          cover_image: coverImagePath,
          epub_file: epubFilePath,
          publication_date: values.publicationDate?.toISOString().split('T')[0],
          page_count: values.pageCount,
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