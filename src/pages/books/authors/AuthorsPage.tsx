import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Plus } from "lucide-react";
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
import { CreateAuthorDialog } from "./CreateAuthorDialog";
import { useToast } from "@/components/ui/use-toast";

export const AuthorsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: authors = [], refetch } = useQuery({
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

  const handleAuthorCreated = () => {
    refetch();
    setIsCreateDialogOpen(false);
    toast({
      title: "Success",
      description: "Author has been created successfully",
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Authors
          </CardTitle>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-purple hover:bg-purple/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Author
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>{author.name}</TableCell>
                  <TableCell>
                    {new Date(author.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateAuthorDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleAuthorCreated}
      />
    </div>
  );
};

export default AuthorsPage;