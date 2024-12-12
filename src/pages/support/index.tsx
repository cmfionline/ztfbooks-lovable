import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const SupportPage = () => {
  const navigate = useNavigate();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
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

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground mt-1">
              Manage and respond to support tickets
            </p>
          </div>
          <Button onClick={() => navigate("new")} className="bg-purple hover:bg-purple/90">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-purple/5 to-purple-light/5 border-purple/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple/10 rounded-full">
                <MessageSquare className="w-6 h-6 text-purple" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Tickets
                </h3>
                <p className="text-2xl font-bold">{tickets?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/5 to-green-600/5 border-green-500/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <HelpCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Open Tickets
                </h3>
                <p className="text-2xl font-bold">
                  {tickets?.filter((t) => t.status === "open").length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 border-yellow-500/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <MessageSquare className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Pending Tickets
                </h3>
                <p className="text-2xl font-bold">
                  {tickets?.filter((t) => t.status === "pending").length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading tickets...
                  </TableCell>
                </TableRow>
              ) : tickets?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                tickets?.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`${ticket.id}`)}
                  >
                    <TableCell className="font-medium">
                      {ticket.subject}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(ticket.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(ticket.updated_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;