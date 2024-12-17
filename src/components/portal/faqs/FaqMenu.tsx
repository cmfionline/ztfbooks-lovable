import { useQuery } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface FaqGroup {
  id: string;
  name: string;
  description: string | null;
}

export const FaqMenu = ({ onGroupSelect }: { onGroupSelect: (groupId: string) => void }) => {
  const { data: faqGroups, isLoading } = useQuery({
    queryKey: ["portal-faq-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_groups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FaqGroup[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-10 bg-muted animate-pulse rounded-lg" />
        <div className="h-10 bg-muted animate-pulse rounded-lg" />
        <div className="h-10 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-2 pr-4">
        {faqGroups?.map((group) => (
          <Button
            key={group.id}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onGroupSelect(group.id)}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            {group.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};