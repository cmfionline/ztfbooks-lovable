import { useState } from "react";
import { Bell, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NotificationForm = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [externalLink, setExternalLink] = useState("");

  const handleSendNotification = async () => {
    try {
      const { error } = await supabase.functions.invoke("send-notification", {
        body: {
          title,
          message,
          image_url: imageUrl || undefined,
          external_link: externalLink || undefined,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification sent successfully",
      });

      setTitle("");
      setMessage("");
      setImageUrl("");
      setExternalLink("");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Send Push Notification
        </CardTitle>
        <CardDescription>
          Send push notifications to your users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            placeholder="Notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea
            placeholder="Notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Image URL (optional)</Label>
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>External Link (optional)</Label>
          <Input
            placeholder="https://example.com"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSendNotification}
          disabled={!title || !message}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Notification
        </Button>
      </CardContent>
    </Card>
  );
};