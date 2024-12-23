import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EbooksHeader } from "./components/EbooksHeader";
import { EbooksSearch } from "./components/EbooksSearch";
import { EbooksTable } from "./components/EbooksTable";
import { useEbooksData } from "./hooks/useEbooksData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { BookLoadingState } from "@/components/books/BookLoadingState";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  if (isLoading) {
    return <BookLoadingState />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading books: {error.message}
          <button
            onClick={() => refetch()}
            className="ml-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
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
    <ErrorBoundary>
      <div>
        <EbooksHeader />
        <EbooksSearch value={searchQuery} onChange={setSearchQuery} />
        <Card className="p-6">
          <EbooksTable
            books={filteredBooks || []}
            onToggleTopSelling={(id, status) => {
              console.log('Toggle top selling', id, status);
            }}
            onToggleFeatured={handleFeaturedToggle}
            onDelete={handleDelete}
          />
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default EbooksPage;
