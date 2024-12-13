import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import CreateFaqGroupDialog from "@/components/faqs/CreateFaqGroupDialog";
import FaqGroupsList from "@/components/faqs/FaqGroupsList";

const Faqs = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const { data: faqGroups, isLoading } = useQuery({
    queryKey: ["faq-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_groups")
        .select(`
          id,
          name,
          description,
          faqs (
            id,
            question,
            answer,
            order_index
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">FAQs Management</h1>
          <Button onClick={() => setIsCreateGroupOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ Group
          </Button>
        </div>

        <FaqGroupsList groups={faqGroups || []} />

        <CreateFaqGroupDialog
          open={isCreateGroupOpen}
          onOpenChange={setIsCreateGroupOpen}
        />
      </div>
    </div>
  );
};

export default Faqs;