import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PortalSupport = () => {
  const navigate = useNavigate();
  const { data: tickets } = useQuery({
    queryKey: ["user-tickets"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Support</h1>
        <Button onClick={() => navigate("/portal/support/new")} className="bg-purple hover:bg-purple/90">
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="grid gap-4">
        {tickets?.map((ticket) => (
          <Card key={ticket.id} className="cursor-pointer hover:bg-accent/50" onClick={() => navigate(`/portal/support/${ticket.id}`)}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-purple" />
                {ticket.subject}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{ticket.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded-full ${
                  ticket.status === "open" ? "bg-green-500/10 text-green-500" :
                  ticket.status === "closed" ? "bg-red-500/10 text-red-500" :
                  "bg-yellow-500/10 text-yellow-500"
                }`}>
                  {ticket.status}
                </span>
                <span className="text-muted-foreground">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortalSupport;