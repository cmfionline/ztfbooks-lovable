import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Link as RouterLink } from "react-router-dom";
import { SearchBar } from "./components/SearchBar";
import { EbookTableRow } from "./components/EbookTableRow";
import { Book } from "@/types/book";

const EbooksPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const { data: books, isLoading, refetch } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          series (name)
        `);
      
      if (error) {
        console.error("Error fetching books:", error);
        toast({
          variant: "destructive",
          title: "Error fetching books",
          description: error.message,
        });
        return [];
      }
      return data as Book[];
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);

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

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("books")
      .update({ is_featured: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating featured status",
        description: error.message,
      });
      return;
    }

    toast({
      title: `Book ${currentStatus ? 'removed from' : 'marked as'} featured`,
    });
    refetch();
  };

  const handleToggleTopSelling = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("books")
      .update({ is_top_selling: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating top selling status",
        description: error.message,
      });
      return;
    }

    toast({
      title: `Book ${currentStatus ? 'removed from' : 'marked as'} top selling`,
    });
    refetch();
  };

  const filteredBooks = books?.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.authors?.name.toLowerCase().includes(search.toLowerCase()) ||
    book.series?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const displayedBooks = filteredBooks?.slice(0, parseInt(entriesPerPage));

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">eBooks Management</h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <RouterLink to="/books/add">
              Add New Book
            </RouterLink>
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select 
              className="border rounded p-1"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">SR NO.</TableHead>
                  <TableHead className="w-[100px]">IMAGE</TableHead>
                  <TableHead>BOOK NAME</TableHead>
                  <TableHead>AUTHOR</TableHead>
                  <TableHead>SERIES</TableHead>
                  <TableHead className="w-[120px]">TOP SELLING</TableHead>
                  <TableHead className="w-[120px]">RECOMMENDED</TableHead>
                  <TableHead className="w-[150px] text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedBooks?.map((book, index) => (
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