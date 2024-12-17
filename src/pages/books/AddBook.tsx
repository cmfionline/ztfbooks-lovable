import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Book } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BookForm } from "@/components/books/BookForm";
import type { BookFormValues } from "./schema";
import { Button } from "@/components/ui/button";

const AddBook = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAddingBooks, setIsAddingBooks] = useState(false);

  const handleSubmit = async (values: BookFormValues) => {
    try {
      let coverImagePath = null;
      let epubFilePath = null;

      if (values.coverImage) {
        const { data: coverData, error: coverError } = await supabase.storage
          .from("books")
          .upload(`covers/${Date.now()}-${values.coverImage.name}`, values.coverImage);

        if (coverError) throw coverError;
        coverImagePath = coverData.path;
      }

      if (values.epubFile) {
        const { data: epubData, error: epubError } = await supabase.storage
          .from("books")
          .upload(`epubs/${Date.now()}-${values.epubFile.name}`, values.epubFile);

        if (epubError) throw epubError;
        epubFilePath = epubData.path;
      }

      const { error } = await supabase
        .from("books")
        .insert([
          {
            title: values.title,
            synopsis: values.synopsis,
            is_free: values.isFree,
            price: values.isFree ? 0 : values.price,
            series_id: values.seriesId === "null" ? null : values.seriesId,
            author_id: values.authorId,
            publisher_id: values.publisherId === "null" ? null : values.publisherId,
            language_id: values.languageId,
            cover_image: coverImagePath,
            epub_file: epubFilePath,
            publication_date: values.publicationDate?.toISOString().split('T')[0],
            page_count: values.pageCount,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book has been added successfully",
      });

      navigate("/books");
    } catch (error: any) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addFomumBooks = async () => {
    setIsAddingBooks(true);
    try {
      const fomumBooks = [
        {
          title: "From His Lips on Marriage",
          cover_image: "covers/fomum-marriage.png",
          author_id: "your_author_id", // You'll need to replace this with the actual author ID
          language_id: "your_language_id", // You'll need to replace this with the actual language ID
          is_free: false,
          price: 9.99
        },
        {
          title: "The Authority and Power of His Life",
          cover_image: "covers/fomum-authority.png",
          author_id: "your_author_id",
          language_id: "your_language_id",
          is_free: false,
          price: 9.99
        },
        {
          title: "The Battles He Fought",
          cover_image: "covers/fomum-battles.png",
          author_id: "your_author_id",
          language_id: "your_language_id",
          is_free: false,
          price: 9.99
        },
        {
          title: "The Work is the Worker Volume 2",
          cover_image: "covers/fomum-work.png",
          author_id: "your_author_id",
          language_id: "your_language_id",
          is_free: false,
          price: 9.99
        },
        {
          title: "The Fruit of His Life",
          cover_image: "covers/fomum-fruit.png",
          author_id: "your_author_id",
          language_id: "your_language_id",
          is_free: false,
          price: 9.99
        }
      ];

      // Upload images to Supabase Storage
      for (const book of fomumBooks) {
        const imagePath = `public/lovable-uploads/${book.title.toLowerCase().replace(/\s+/g, '-')}.png`;
        const { error: uploadError } = await supabase.storage
          .from('books')
          .upload(book.cover_image, imagePath, {
            upsert: true
          });

        if (uploadError) {
          console.error(`Error uploading image for ${book.title}:`, uploadError);
          continue;
        }
      }

      // Insert books into the database
      const { error } = await supabase
        .from('books')
        .insert(fomumBooks);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fomum books have been added to the catalog",
      });

      navigate("/books");
    } catch (error: any) {
      console.error("Error adding Fomum books:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add Fomum books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingBooks(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Book className="w-6 h-6" />
              Add New Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-6">
              <Button 
                onClick={addFomumBooks}
                disabled={isAddingBooks}
                variant="outline"
                className="border-purple hover:bg-purple/10"
              >
                Add Fomum Books to Catalog
              </Button>
            </div>
            <BookForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBook;