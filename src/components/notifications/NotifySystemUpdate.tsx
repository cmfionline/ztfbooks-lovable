import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NotifySystemUpdateProps {
  updateTitle: string;
  updateDescription: string;
  updateType: 'feature' | 'improvement' | 'fix';
}

export const NotifySystemUpdate = ({ 
  updateTitle, 
  updateDescription, 
  updateType 
}: NotifySystemUpdateProps) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendNotification = async () => {
    try {
      setIsSending(true);
      
      const response = await supabase.functions.invoke('send-system-notification', {
        body: {
          type: 'system_update',
          variables: {
            update_title: updateTitle,
            update_description: updateDescription,
            update_type: updateType,
          },
        },
      });

      if (!response.error) {
        toast({
          title: "Success",
          description: "Update notification sent to all subscribed users",
        });
      } else {
        throw new Error(response.error.message);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={sendNotification}
      disabled={isSending}
      className="flex items-center gap-2"
    >
      <Bell className="w-4 h-4" />
      {isSending ? "Sending..." : "Notify Users"}
    </Button>
  );
};