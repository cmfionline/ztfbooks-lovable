import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { SearchInput } from "@/components/ui/search-input";
import { AuthorLoadingState } from "./components/AuthorLoadingState";
import { AuthorsList } from "./components/AuthorsList";
import { AuthorsHeader } from "./components/AuthorsHeader";

export const AuthorsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

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

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load authors. Please try again.",
      variant: "destructive",
    });
  }

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.nationality?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <AuthorsHeader 
            title="Authors" 
            onAddClick={() => navigate("/books/authors/add")} 
          />
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, nationality..."
            />
          </div>

          {isLoading ? (
            <AuthorLoadingState />
          ) : (
            <AuthorsList 
              authors={filteredAuthors} 
              onDelete={handleDelete} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorsPage;