import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CreateFaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string | null;
}

const CreateFaqDialog = ({ open, onOpenChange, groupId }: CreateFaqDialogProps) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createFaq = useMutation({
    mutationFn: async () => {
      if (!groupId) throw new Error("No group selected");

      const { data, error } = await supabase
        .from("faqs")
        .insert({
          group_id: groupId,
          question,
          answer,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-groups"] });
      toast({
        title: "Success",
        description: "FAQ created successfully",
      });
      onOpenChange(false);
      setQuestion("");
      setAnswer("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
      console.error("Error creating FAQ:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFaq.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New FAQ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter FAQ question"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter FAQ answer"
              required
              className="min-h-[200px]"
            />
          </div>
          <Button type="submit" className="w-full">
            Create FAQ
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFaqDialog;