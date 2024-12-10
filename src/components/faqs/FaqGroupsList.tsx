import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import CreateFaqDialog from "./CreateFaqDialog";
import { useToast } from "@/components/ui/use-toast";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

interface FaqGroup {
  id: string;
  name: string;
  description: string | null;
  faqs: FAQ[];
}

interface FaqGroupsListProps {
  groups: FaqGroup[];
}

const FaqGroupsList = ({ groups }: FaqGroupsListProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isCreateFaqOpen, setIsCreateFaqOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteFaq = useMutation({
    mutationFn: async (faqId: string) => {
      const { error } = await supabase
        .from("faqs")
        .delete()
        .eq("id", faqId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-groups"] });
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
      console.error("Error deleting FAQ:", error);
    },
  });

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <Card key={group.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{group.name}</CardTitle>
              {group.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {group.description}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedGroup(group.id);
                setIsCreateFaqOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.faqs?.map((faq) => (
                <div
                  key={faq.id}
                  className="border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-medium">{faq.question}</h3>
                      <div
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteFaq.mutate(faq.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <CreateFaqDialog
        open={isCreateFaqOpen}
        onOpenChange={setIsCreateFaqOpen}
        groupId={selectedGroup}
      />
    </div>
  );
};

export default FaqGroupsList;