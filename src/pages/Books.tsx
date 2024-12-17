import { Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import AddBook from "./books/AddBook";
import EditBook from "./books/EditBook";
import AuthorsPage from "./books/authors/AuthorsPage";
import AddAuthor from "./books/authors/AddAuthor";
import EditAuthor from "./books/authors/EditAuthor";
import SeriesPage from "./books/series/SeriesPage";
import AddSeries from "./books/series/AddSeries";
import EditSeries from "./books/series/EditSeries";
import PublishersPage from "./books/publishers/PublishersPage";
import AddPublisher from "./books/publishers/AddPublisher";
import EditPublisher from "./books/publishers/EditPublisher";
import TagsPage from "./books/tags/TagsPage";
import AddTag from "./books/tags/AddTag";
import EditTag from "./books/tags/EditTag";
import LanguagesPage from "./books/languages/LanguagesPage";
import AddLanguage from "./books/languages/AddLanguage";
import EditLanguage from "./books/languages/EditLanguage";
import EbooksPage from "./books/ebooks/EbooksPage";

const BooksListing = () => {
  const { toast } = useToast();

  const { data: booksData, isLoading, refetch } = useQuery({
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
        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Series</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Publisher</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Updated On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {booksData?.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.authors?.name || "N/A"}</TableCell>
                    <TableCell>{book.series?.name || "N/A"}</TableCell>
                    <TableCell>{book.languages?.name || "N/A"}</TableCell>
                    <TableCell>{book.publishers?.name || "N/A"}</TableCell>
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
                        asChild
                      >
                        <Link to={`/books/${book.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link to={`/books/${book.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
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

const Books = () => {
  return (
    <Routes>
      <Route index element={<BooksListing />} />
      <Route path="add" element={<AddBook />} />
      <Route path=":id/edit" element={<EditBook />} />
      <Route path="ebooks/*" element={<EbooksPage />} />
      <Route path="authors/*" element={<AuthorsPage />} />
      <Route path="authors/add" element={<AddAuthor />} />
      <Route path="authors/:id/edit" element={<EditAuthor />} />
      <Route path="series/*" element={<SeriesPage />} />
      <Route path="series/add" element={<AddSeries />} />
      <Route path="series/:id/edit" element={<EditSeries />} />
      <Route path="publishers/*" element={<PublishersPage />} />
      <Route path="publishers/add" element={<AddPublisher />} />
      <Route path="publishers/:id/edit" element={<EditPublisher />} />
      <Route path="tags/*" element={<TagsPage />} />
      <Route path="tags/add" element={<AddTag />} />
      <Route path="tags/:id/edit" element={<EditTag />} />
    </Routes>
  );
};

export default Books;
