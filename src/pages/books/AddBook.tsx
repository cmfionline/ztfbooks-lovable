import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Book } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BookForm, type BookFormValues } from "./components/BookForm";
import { NotifyNewBook } from "@/components/books/NotifyNewBook";

const AddBook = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newBook, setNewBook] = useState<any>(null);
  const [authorData, setAuthorData] = useState<any>(null);

  const handleSubmit = async (values: BookFormValues) => {
    try {
      let coverImagePath = null;
      let epubFilePath = null;

      if (values.cover_image) {
        const { data: coverData, error: coverError } = await supabase.storage
          .from("books")
          .upload(`covers/${Date.now()}-${values.cover_image.name}`, values.cover_image);

        if (coverError) throw coverError;
        coverImagePath = coverData.path;
      }

      if (values.epub_file) {
        const { data: epubData, error: epubError } = await supabase.storage
          .from("books")
          .upload(`epubs/${Date.now()}-${values.epub_file.name}`, values.epub_file);

        if (epubError) throw epubError;
        epubFilePath = epubData.path;
      }

      const { data: newBook, error } = await supabase
        .from("books")
        .insert([
          {
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
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const { data: authorData } = await supabase
        .from("authors")
        .select("name")
        .eq("id", values.author_id)
        .single();

      setNewBook(newBook);
      setAuthorData(authorData);

      toast({
        title: "Success",
        description: "Book has been added successfully",
      });
    } catch (error: any) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add book. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Book className="w-6 h-6" />
              Add New Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookForm onSubmit={handleSubmit} onCancel={() => navigate("/books")} />
            {newBook && authorData && (
              <div className="mt-4 flex justify-end">
                <NotifyNewBook
                  bookTitle={newBook.title}
                  bookId={newBook.id}
                  authorName={authorData?.name || "Unknown Author"}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBook;