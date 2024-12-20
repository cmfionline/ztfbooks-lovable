import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentBlockForm } from "@/components/content-blocks/ContentBlockForm";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContentBlocks = () => {
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const { data: contentBlocks, refetch } = useQuery({
    queryKey: ["content-blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_blocks")
        .select("*")
        .order("order_index");

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("content_blocks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content block deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Blocks</h1>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="w-4 h-4 mr-2" />
          Add Content Block
        </Button>
      </div>

      {(isCreating || selectedBlock) && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {selectedBlock ? "Edit" : "Create"} Content Block
          </h2>
          <ContentBlockForm
            initialData={selectedBlock}
            onSuccess={() => {
              setSelectedBlock(null);
              setIsCreating(false);
              refetch();
            }}
          />
        </div>
      )}

      <div className="grid gap-4">
        {contentBlocks?.map((block) => (
          <Card key={block.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{block.title}</h3>
                {block.subtitle && (
                  <p className="text-sm text-muted-foreground">{block.subtitle}</p>
                )}
                {block.description && (
                  <p className="mt-2 text-sm">{block.description}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Order: {block.order_index}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Status: {block.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedBlock(block);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(block.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentBlocks;