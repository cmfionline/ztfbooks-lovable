import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NotifyNewBookProps {
  bookTitle: string;
  bookId: string;
  authorName: string;
}

export const NotifyNewBook = ({ bookTitle, bookId, authorName }: NotifyNewBookProps) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendNotification = async () => {
    try {
      setIsSending(true);
      
      const { data: { publicUrl: bookUrl } } = supabase
        .storage
        .from('books')
        .getPublicUrl(`covers/${bookId}`);

      const response = await fetch('/functions/v1/send-system-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'new_book',
          variables: {
            book_title: bookTitle,
            author_name: authorName,
            book_url: bookUrl,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      toast({
        title: "Success",
        description: "Notification sent to all subscribed users",
      });
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