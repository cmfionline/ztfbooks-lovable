import { useState } from "react";
import { Bell, Send, Calendar } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NotificationForm = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [scheduleType, setScheduleType] = useState("immediate");
  const [scheduledFor, setScheduledFor] = useState("");
  const [recurringType, setRecurringType] = useState("daily");
  const [recurringTime, setRecurringTime] = useState("09:00");

  const handleSendNotification = async () => {
    try {
      let schedulingData = {};
      
      if (scheduleType === "scheduled") {
        schedulingData = {
          scheduled_for: new Date(scheduledFor).toISOString(),
        };
      } else if (scheduleType === "recurring") {
        schedulingData = {
          recurring_schedule: {
            type: recurringType,
            time: recurringTime,
          },
        };
      }

      const { error } = await supabase.functions.invoke("send-notification", {
        body: {
          title,
          message,
          image_url: imageUrl || undefined,
          external_link: externalLink || undefined,
          schedule_type: scheduleType,
          ...schedulingData,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: scheduleType === "immediate" 
          ? "Notification sent successfully"
          : "Notification scheduled successfully",
      });

      setTitle("");
      setMessage("");
      setImageUrl("");
      setExternalLink("");
      setScheduleType("immediate");
      setScheduledFor("");
      setRecurringType("daily");
      setRecurringTime("09:00");
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
          Send or schedule push notifications to your users
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
        
        <div className="space-y-4">
          <Label className="text-sm font-medium text-primary">Schedule Type</Label>
          <RadioGroup
            value={scheduleType}
            onValueChange={setScheduleType}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate">Send Immediately</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <Label htmlFor="scheduled">Schedule for Later</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="recurring" id="recurring" />
              <Label htmlFor="recurring">Recurring Schedule</Label>
            </div>
          </RadioGroup>
        </div>

        {scheduleType === "scheduled" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">Schedule Date & Time</Label>
            <Input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="border-purple-light focus:border-purple focus:ring-purple"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}

        {scheduleType === "recurring" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">Recurring Type</Label>
              <Select value={recurringType} onValueChange={setRecurringType}>
                <SelectTrigger className="border-purple-light focus:border-purple focus:ring-purple">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">Time</Label>
              <Input
                type="time"
                value={recurringTime}
                onChange={(e) => setRecurringTime(e.target.value)}
                className="border-purple-light focus:border-purple focus:ring-purple"
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleSendNotification}
          disabled={!title || !message || (scheduleType === "scheduled" && !scheduledFor)}
          className="w-full bg-purple hover:bg-purple/90 text-white"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {scheduleType === "immediate" ? "Send Now" : "Schedule Notification"}
        </Button>
      </CardContent>
    </Card>
  );
};