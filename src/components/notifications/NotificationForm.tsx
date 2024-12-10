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
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Bell className="h-5 w-5 text-purple" />
          Send Push Notification
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Send push notifications to your users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">Title</Label>
          <Input
            placeholder="Notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-purple-light focus:border-purple focus:ring-purple"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">Message</Label>
          <Textarea
            placeholder="Notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[80px] border-purple-light focus:border-purple focus:ring-purple"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">Image URL (optional)</Label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border-purple-light focus:border-purple focus:ring-purple"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">External Link (optional)</Label>
            <Input
              placeholder="https://example.com"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              className="border-purple-light focus:border-purple focus:ring-purple"
            />
          </div>
        </div>
        <Button
          onClick={handleSendNotification}
          disabled={!title || !message}
          className="w-full bg-purple hover:bg-purple/90 text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Notification
        </Button>
      </CardContent>
    </Card>
  );
};