import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { SearchInput } from "@/components/ui/search-input";
import { TagList } from "./components/TagList";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

const ITEMS_PER_PAGE = 10;

const TagsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: tags = [], isLoading, refetch } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching tags:", error);
        toast({
          variant: "destructive",
          title: "Error fetching tags",
          description: error.message,
        });
        return [];
      }
      return data || [];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Tag deleted successfully",
      });
      refetch();
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      toast({
        variant: "destructive",
        title: "Error deleting tag",
        description: error.message,
      });
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTags.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTags = filteredTags.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tags Management</h1>
          <Link to="/books/tags/add">
            <Button className="bg-purple hover:bg-purple/90">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tags..."
          />
        </div>

        <QueryErrorBoundary>
          <Card className="p-6">
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TagList 
                    paginatedTags={paginatedTags}
                    handleDelete={handleDelete}
                  />
                </Table>

                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Card>
        </QueryErrorBoundary>
      </div>
    </div>
  );
};

export default TagsPage;