import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Star, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const EbooksPage = () => {
  const { toast } = useToast();

  const { data: books, isLoading, refetch } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          languages (name),
          series (name),
          publishers (name)
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

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">eBooks Management</h1>
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
                  <TableHead>Price</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Updated On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books?.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.authors?.name || "N/A"}</TableCell>
                    <TableCell>{book.languages?.name || "N/A"}</TableCell>
                    <TableCell>
                      {book.is_free ? "Free" : `$${book.price?.toFixed(2) || "N/A"}`}
                    </TableCell>
                    <TableCell>
                      {format(new Date(book.created_at), "PPP")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(book.updated_at), "PPP")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFeatured(book.id, book.is_featured)}
                        className={book.is_featured ? "text-yellow-500" : ""}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(book.id)}
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