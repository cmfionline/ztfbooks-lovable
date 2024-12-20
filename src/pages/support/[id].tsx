import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      if (!id) throw new Error("Ticket ID is required");
      
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*, profiles(full_name)")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["ticket-messages", id],
    queryFn: async () => {
      if (!id) throw new Error("Ticket ID is required");
      
      const { data, error } = await supabase
        .from("support_messages")
        .select("*, profiles(full_name)")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!id) throw new Error("Ticket ID is required");
      
      const { error } = await supabase.from("support_messages").insert([
        {
          ticket_id: id,
          sender_id: userData.user?.id,
          message,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", id] });
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "closed":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    }
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    }
  };

  if (ticketLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </div>
    );
  }

  return (
    <QueryErrorBoundary>
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/support")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Support
          </Button>

          {ticket && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{ticket.subject}</h1>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <span>
                    Opened by {ticket.profiles?.full_name} on{" "}
                    {format(new Date(ticket.created_at), "MMM d, yyyy")}
                  </span>
                  <Badge variant="outline">{ticket.category}</Badge>
                </div>
              </div>

              <Card className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p>{ticket.description}</p>
                </div>
              </Card>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Messages</h2>
                <div className="space-y-4">
                  {messages?.map((message) => (
                    <Card key={message.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">
                          {message.profiles?.full_name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(message.created_at), "MMM d, yyyy HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </Card>
                  ))}
                </div>

                <Card className="p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newMessage.trim()) {
                        sendMessageMutation.mutate(newMessage);
                      }
                    }}
                    className="space-y-4"
                  >
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-purple hover:bg-purple/90"
                        disabled={sendMessageMutation.isPending || !newMessage.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </QueryErrorBoundary>
  );
};

export default TicketDetailsPage;