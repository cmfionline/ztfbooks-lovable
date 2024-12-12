import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Link2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import AddPage from "@/components/pages/AddPage";
import EditPage from "@/components/pages/EditPage";

type Page = Database['public']['Tables']['pages']['Row'];

const PagesListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: pages, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('order_index');

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching pages",
          description: error.message,
        });
        return [];
      }

      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pages Management</h1>
          <Button 
            onClick={() => navigate("/pages/add")} 
            className="bg-accent hover:bg-accent/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Page
          </Button>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                pages?.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      {page.title}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={page.status === 'active' ? 'default' : 'secondary'}
                        className={
                          page.status === 'active' 
                            ? 'bg-success hover:bg-success/80' 
                            : 'bg-muted hover:bg-muted/80'
                        }
                      >
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-purple-light/30"
                      >
                        <Link2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-purple-light/30"
                        onClick={() => navigate(`/pages/${page.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

const Pages = () => {
  return (
    <Routes>
      <Route path="/*" element={<PagesListing />} />
      <Route path="/add" element={<AddPage />} />
      <Route path="/:id/edit" element={<EditPage />} />
    </Routes>
  );
};

export default Pages;