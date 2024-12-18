import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import { BookForm } from "@/components/books/BookForm";
import { FomumBooksButton } from "@/components/books/FomumBooksButton";
import type { BookFormValues } from "./schema";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const AddBook = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
            discount_percentage: values.hasDiscount ? values.discount_percentage : null,
            discount_start_date: values.hasDiscount ? values.discount_start_date : null,
            discount_end_date: values.hasDiscount ? values.discount_end_date : null,
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
              <FomumBooksButton />
            </div>
            <BookForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBook;