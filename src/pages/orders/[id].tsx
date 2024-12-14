import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { ArrowLeft, Clock, User, Book, Loader2 } from "lucide-react";
import { orderSchema } from "@/components/orders/schema";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const updateOrderMutation = useMutation({
    mutationFn: async ({ status, payment_status, notes }: { status: string; payment_status: string; notes?: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status, payment_status, notes })
        .eq("id", id);

      if (error) throw error;

      // Create order history entry
      const { error: historyError } = await supabase
        .from("order_history")
        .insert({
          order_id: id,
          status,
          notes,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (historyError) throw historyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      toast({
        title: "Order updated",
        description: "The order has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating order",
        description: error.message,
      });
    },
  });

  const handleStatusChange = async (newStatus: string) => {
    try {
      const validatedData = orderSchema.parse({
        status: newStatus,
        payment_status: order?.payment_status || "pending",
        notes: order?.notes,
      });

      await updateOrderMutation.mutateAsync(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.message,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
                disabled={updateOrderMutation.isPending}
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
    </ErrorBoundary>
  );
};

export default OrderDetailsPage;