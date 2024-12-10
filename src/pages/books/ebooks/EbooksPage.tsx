import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Star, Trash2, Link } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Link as RouterLink } from "react-router-dom";

const EbooksPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: books, isLoading, refetch } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          series (name),
          cover_image
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
      return data || [];
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

  const handleToggleFeatured = async (id: string, currentStatus: boolean | null) => {
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

  const handleToggleTopSelling = async (id: string, currentStatus: boolean | null) => {
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
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input
              type="search"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="border rounded p-1">
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
                {filteredBooks?.map((book, index) => (
                  <TableRow key={book.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {book.cover_image ? (
                        <img 
                          src={book.cover_image} 
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                          No Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.authors?.name || "N/A"}</TableCell>
                    <TableCell>{book.series?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={book.is_top_selling || false}
                        onCheckedChange={() => handleToggleTopSelling(book.id, book.is_top_selling)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={book.is_featured || false}
                        onCheckedChange={() => handleToggleFeatured(book.id, book.is_featured)}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-teal-50 text-teal-600"
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-50 text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(book.id)}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
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