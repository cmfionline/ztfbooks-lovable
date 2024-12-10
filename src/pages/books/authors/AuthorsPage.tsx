import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { User, UserPlus, Pencil, Trash, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AuthorsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const { data: authors = [], isLoading, error } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load authors. Please try again.",
      variant: "destructive",
    });
  }

  const handleEdit = (id: string) => {
    navigate(`/books/authors/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("authors")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Author has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting author:", error);
      toast({
        title: "Error",
        description: "Failed to delete author. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(search.toLowerCase()) ||
    author.nationality?.toLowerCase().includes(search.toLowerCase()) ||
    author.designation?.toLowerCase().includes(search.toLowerCase()) ||
    author.education?.toLowerCase().includes(search.toLowerCase())
  );

  const displayedAuthors = filteredAuthors.slice(0, parseInt(entriesPerPage));

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Authors
          </CardTitle>
          <Button
            onClick={() => navigate("/books/authors/add")}
            className="bg-purple hover:bg-purple/90"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Author
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
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

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">SR NO.</TableHead>
                  <TableHead className="w-[100px]">PHOTO</TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead>DESIGNATION</TableHead>
                  <TableHead>EDUCATION</TableHead>
                  <TableHead>NATIONALITY</TableHead>
                  <TableHead>CONTACT</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedAuthors.map((author, index) => (
                  <TableRow key={author.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={author.photo || ""} alt={author.name} />
                        <AvatarFallback>
                          {author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{author.name}</TableCell>
                    <TableCell>{author.designation || "-"}</TableCell>
                    <TableCell>{author.education || "-"}</TableCell>
                    <TableCell>{author.nationality || "-"}</TableCell>
                    <TableCell>{author.mobile || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(author.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(author.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorsPage;