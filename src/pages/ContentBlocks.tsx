import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const ContentBlocks = () => {
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("content_blocks")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content block deleted successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete content block",
      });
    },
  });

  const handleAddClick = () => {
    navigate("add");
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

      <div className="grid gap-4">
        {contentBlocks?.map((block) => (
          <Card key={block.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{block.title}</h3>
                <p className="text-sm text-gray-600">{block.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`${block.id}/edit`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this content block?")) {
                      deleteMutation.mutate(block.id);
                    }
                  }}
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