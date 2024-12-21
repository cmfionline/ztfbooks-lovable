import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EbooksHeader } from "./components/EbooksHeader";
import { EbooksSearch } from "./components/EbooksSearch";
import { EbooksTable } from "./components/EbooksTable";
import { useEbooksData } from "./hooks/useEbooksData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { BookLoadingState } from "@/components/books/BookLoadingState";

const EbooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: books, isLoading, error, refetch } = useEbooksData();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting book",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Book deleted successfully",
    });
    refetch();
  };

  const handleFeaturedToggle = async (id: string, status: boolean) => {
    const { error } = await supabase
      .from('books')
      .update({ is_featured: status })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating featured status",
        description: error.message,
      });
      return;
    }

    toast({
      title: status ? "Book marked as featured" : "Book removed from featured",
    });
    refetch();
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p>Error loading books: {error.message}</p>
        </div>
      </div>
    );
  }

  const filteredBooks = books?.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.authors?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.languages?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.publishers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.series?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <EbooksHeader />
      <EbooksSearch value={searchQuery} onChange={setSearchQuery} />
      <Card className="p-6">
        {isLoading ? (
          <BookLoadingState />
        ) : (
          <EbooksTable
            books={filteredBooks || []}
            onToggleTopSelling={(id, status) => {
              console.log('Toggle top selling', id, status);
            }}
            onToggleFeatured={handleFeaturedToggle}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </div>
  );
};

export default EbooksPage;