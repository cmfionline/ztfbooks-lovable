import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CreateFaqGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFaqGroupDialog = ({ open, onOpenChange }: CreateFaqGroupDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createGroup = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("faq_groups")
        .insert({ name, description })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-groups"] });
      toast({
        title: "Success",
        description: "FAQ group created successfully",
      });
      onOpenChange(false);
      setName("");
      setDescription("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create FAQ group",
        variant: "destructive",
      });
      console.error("Error creating FAQ group:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGroup.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New FAQ Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter group description"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFaqGroupDialog;