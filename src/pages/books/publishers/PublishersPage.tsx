import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const PublishersPage = () => {
  const { toast } = useToast();

  const { data: publishers = [], isLoading, refetch } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publishers")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching publishers:", error);
        toast({
          variant: "destructive",
          title: "Error fetching publishers",
          description: error.message,
        });
        return [];
      }
      return data || [];
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("publishers")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting publisher",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Publisher deleted successfully",
    });
    refetch();
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Publishers Management</h1>
          <Link to="/books/publishers/add">
            <Button className="bg-purple hover:bg-purple/90">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Publisher
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publishers.map((publisher) => (
                  <TableRow key={publisher.id}>
                    <TableCell className="font-medium">{publisher.name}</TableCell>
                    <TableCell>{publisher.email || "N/A"}</TableCell>
                    <TableCell>{publisher.phone || "N/A"}</TableCell>
                    <TableCell>{publisher.city || "N/A"}</TableCell>
                    <TableCell>{publisher.country || "N/A"}</TableCell>
                    <TableCell>
                      {format(new Date(publisher.created_at), "PPP")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link to={`/books/publishers/${publisher.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link to={`/books/publishers/${publisher.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(publisher.id)}
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

export default PublishersPage;