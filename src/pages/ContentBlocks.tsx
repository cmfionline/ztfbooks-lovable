import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContentBlockForm } from "@/components/content-blocks/ContentBlockForm";
import { ContentBlocksTable } from "@/components/content-blocks/table/ContentBlocksTable";
import { useNavigate, useLocation } from "react-router-dom";

const ContentBlocks = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: contentBlocks, refetch } = useQuery({
    queryKey: ["content-blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_blocks")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleAddClick = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    navigate("/content-blocks");
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetch();
    navigate("/content-blocks");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Blocks</h1>
        <Button 
          onClick={handleAddClick}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content Block
        </Button>
      </div>

      <Card className="p-6">
        <ContentBlocksTable 
          contentBlocks={contentBlocks || []} 
          onEditClick={(block) => navigate(`/content-blocks/${block.id}/edit`)}
        />
      </Card>

      <Dialog open={isFormOpen} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Add Content Block
            </DialogTitle>
          </DialogHeader>
          <ContentBlockForm 
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentBlocks;