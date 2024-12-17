import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const FomumBooksButton = () => {
  const { toast } = useToast();
  const [isAddingBooks, setIsAddingBooks] = useState(false);

  const addFomumBooks = async () => {
    setIsAddingBooks(true);
    try {
      // First, get the necessary IDs
      const { data: authorData, error: authorError } = await supabase
        .from("authors")
        .select("id")
        .eq("name", "Zacharias Tanee Fomum")
        .single();

      if (authorError) throw authorError;

      const { data: languagesData, error: languageError } = await supabase
        .from("languages")
        .select("id")
        .eq("code", "en");

      if (languageError) throw languageError;
      if (!languagesData?.length) throw new Error("No English language found");

      const { data: publisherData, error: publisherError } = await supabase
        .from("publishers")
        .select("id")
        .eq("name", "Christian Publishing House")
        .single();

      if (publisherError) throw publisherError;

      const fomumBooks = [
        {
          title: "From His Lips on Marriage",
          cover_image: "covers/fomum-marriage.png",
          author_id: authorData.id,
          language_id: languagesData[0].id,
          publisher_id: publisherData.id,
          is_free: false,
          price: 9.99
        },
        {
          title: "The Authority and Power of His Life",
          cover_image: "covers/fomum-authority.png",
          author_id: authorData.id,
          language_id: languagesData[0].id,
          publisher_id: publisherData.id,
          is_free: false,
          price: 9.99
        },
        {
          title: "The Battles He Fought",
          cover_image: "covers/fomum-battles.png",
          author_id: authorData.id,
          language_id: languagesData[0].id,
          publisher_id: publisherData.id,
          is_free: false,
          price: 9.99
        },
        {
          title: "The Work is the Worker Volume 2",
          cover_image: "covers/fomum-work.png",
          author_id: authorData.id,
          language_id: languagesData[0].id,
          publisher_id: publisherData.id,
          is_free: false,
          price: 9.99
        },
        {
          title: "The Fruit of His Life",
          cover_image: "covers/fomum-fruit.png",
          author_id: authorData.id,
          language_id: languagesData[0].id,
          publisher_id: publisherData.id,
          is_free: false,
          price: 9.99
        }
      ];

      // Insert books into the database
      const { error } = await supabase
        .from('books')
        .insert(fomumBooks);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fomum books have been added to the catalog",
      });
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
    <Button 
      onClick={addFomumBooks}
      disabled={isAddingBooks}
      variant="outline"
      className="border-purple hover:bg-purple/10"
    >
      Add Fomum Books to Catalog
    </Button>
  );
};