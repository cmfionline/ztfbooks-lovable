import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContentBlockForm } from "@/components/content-blocks/ContentBlockForm";
import { ContentBlocksTable } from "@/components/content-blocks/table/ContentBlocksTable";

const ContentBlocks = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<any>(null);

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
    setSelectedBlock(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (block: any) => {
    setSelectedBlock(block);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedBlock(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedBlock(null);
    refetch();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Blocks</h1>
        <Button 
          onClick={handleAddClick}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content Block
        </Button>
      </div>

      <Card className="p-6">
        <ContentBlocksTable 
          contentBlocks={contentBlocks || []} 
          onEditClick={handleEditClick}
        />
      </Card>

      <Dialog open={isFormOpen} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedBlock ? 'Edit Content Block' : 'Add Content Block'}
            </DialogTitle>
          </DialogHeader>
          <ContentBlockForm 
            initialData={selectedBlock}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentBlocks;