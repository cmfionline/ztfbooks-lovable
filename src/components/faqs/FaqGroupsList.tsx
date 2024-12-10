import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Minus, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import CreateFaqDialog from "./CreateFaqDialog";
import { useToast } from "@/components/ui/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

const SortableFaq = ({ faq, onDelete }: { faq: FAQ; onDelete: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: faq.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 hover:bg-accent transition-colors"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <button
              className="cursor-grab hover:bg-accent-foreground/10 p-1 rounded"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <h3 className="font-medium">{faq.question}</h3>
          </div>
          <div
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const FaqGroupsList = ({ groups }: FaqGroupsListProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isCreateFaqOpen, setIsCreateFaqOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateFaqOrder = useMutation({
    mutationFn: async ({
      faqId,
      newIndex,
      groupId,
    }: {
      faqId: string;
      newIndex: number;
      groupId: string;
    }) => {
      const { error } = await supabase
        .from("faqs")
        .update({ order_index: newIndex })
        .eq("id", faqId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-groups"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update FAQ order",
        variant: "destructive",
      });
      console.error("Error updating FAQ order:", error);
    },
  });

  const deleteFaq = useMutation({
    mutationFn: async (faqId: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", faqId);

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

  const handleDragEnd = (event: DragEndEvent, groupId: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    const oldIndex = group.faqs.findIndex((faq) => faq.id === active.id);
    const newIndex = group.faqs.findIndex((faq) => faq.id === over.id);

    updateFaqOrder.mutate({
      faqId: active.id as string,
      newIndex,
      groupId,
    });
  };

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, group.id)}
            >
              <SortableContext
                items={group.faqs.map((faq) => faq.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {group.faqs?.map((faq) => (
                    <SortableFaq
                      key={faq.id}
                      faq={faq}
                      onDelete={() => deleteFaq.mutate(faq.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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