import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EbooksHeader } from "./components/EbooksHeader";
import { EbooksSearch } from "./components/EbooksSearch";
import { EbooksTable } from "./components/EbooksTable";
import { useEbooksData } from "./hooks/useEbooksData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const EbooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: books, isLoading, refetch } = useEbooksData();
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

  const filteredBooks = books?.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.authors?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.languages?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.publishers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.series?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <EbooksHeader />
        <EbooksSearch value={searchQuery} onChange={setSearchQuery} />
        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
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
    </div>
  );
};

export default EbooksPage;