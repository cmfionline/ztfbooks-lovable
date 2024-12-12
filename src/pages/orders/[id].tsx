import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, User, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:profiles(full_name),
          order_items:order_items(
            *,
            book:books(title, cover_image)
          ),
          order_history:order_history(*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching order",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  const handleStatusChange = async (newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Status updated",
      description: `Order status has been updated to ${newStatus}`,
    });
  };

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/orders")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Order #{id?.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground">
              Created on {new Date(order?.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={order?.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order?.profiles?.full_name}</p>
              <p className="text-sm text-muted-foreground">
                Device ID: {order?.device_id || "Not accessed yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                Last Access: {order?.last_accessed
                  ? new Date(order.last_accessed).toLocaleString()
                  : "Never"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order?.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.book?.cover_image}
                      alt={item.book?.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.book?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price_at_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order?.order_history?.map((history) => (
                  <div key={history.id} className="flex items-center gap-2">
                    <Badge variant="outline">{history.status}</Badge>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(history.created_at).toLocaleString()}
                      </p>
                      {history.notes && (
                        <p className="text-sm">{history.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;