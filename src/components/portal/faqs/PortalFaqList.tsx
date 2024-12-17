import { useQuery } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

interface FAQGroup {
  id: string;
  name: string;
  description: string | null;
  faqs: FAQ[];
}

interface PortalFaqListProps {
  selectedGroupId: string | null;
}

export const PortalFaqList = ({ selectedGroupId }: PortalFaqListProps) => {
  const { data: faqGroups, isLoading } = useQuery({
    queryKey: ["portal-faq-groups", selectedGroupId],
    queryFn: async () => {
      const query = supabase
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

      if (selectedGroupId) {
        query.eq("id", selectedGroupId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FAQGroup[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded" />
              <div className="h-12 bg-muted rounded" />
              <div className="h-12 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {faqGroups?.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-purple" />
              {group.name}
            </CardTitle>
            {group.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {group.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {group.faqs
                ?.sort((a, b) => a.order_index - b.order_index)
                .map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-border/40 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left hover:no-underline hover:text-purple">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};