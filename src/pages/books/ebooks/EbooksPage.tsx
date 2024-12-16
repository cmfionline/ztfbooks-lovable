import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchInput } from "@/components/ui/search-input";
import { EbookTableRow } from "./components/EbookTableRow";
import { useToast } from "@/hooks/use-toast";

const EbooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (
            name
          ),
          languages (
            name
          ),
          publishers (
            name
          ),
          series (
            name
          )
        `);

      if (error) {
        console.error("Error fetching books:", error);
        return [];
      }

      return data || [];
    },
  });

  const filteredBooks = books?.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.authors?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.languages?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.publishers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.series?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleTopSelling = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('books')
      .update({ is_top_selling: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating book status",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Book status updated successfully",
    });
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('books')
      .update({ is_featured: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating book status",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Book status updated successfully",
    });
  };

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
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Books Management</h1>
          <Link to="/books/add">
            <Button className="bg-purple hover:bg-purple/90">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title, author, language, publisher, or series..."
          />
        </div>

        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Publisher</TableHead>
                  <TableHead>Series</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks?.map((book, index) => (
                  <EbookTableRow 
                    key={book.id} 
                    book={book} 
                    index={index}
                    onToggleTopSelling={handleToggleTopSelling}
                    onToggleFeatured={handleToggleFeatured}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EbooksPage;