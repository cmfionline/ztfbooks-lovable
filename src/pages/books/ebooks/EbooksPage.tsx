import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EbooksHeader } from "./components/EbooksHeader";
import { EbooksSearch } from "./components/EbooksSearch";
import { EbooksTable } from "./components/EbooksTable";
import { useEbooksData } from "./hooks/useEbooksData";

const EbooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: books, isLoading } = useEbooksData();

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
                // Implementation will be added later
                console.log('Toggle top selling', id, status);
              }}
              onToggleFeatured={(id, status) => {
                // Implementation will be added later
                console.log('Toggle featured', id, status);
              }}
              onDelete={(id) => {
                // Implementation will be added later
                console.log('Delete book', id);
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default EbooksPage;
