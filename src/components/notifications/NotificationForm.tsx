import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationBasicInfo } from "./NotificationBasicInfo";
import { NotificationScheduling } from "./NotificationScheduling";
import { NotificationTargeting } from "./NotificationTargeting";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Send } from "lucide-react";

export const NotificationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    imageUrl: "",
    scheduleType: "immediate",
    scheduledFor: "",
    recurringSchedule: null,
    targetAudience: { type: "all" },
  });

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Message is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("notifications").insert({
        title: formData.title,
        message: formData.message,
        image_url: formData.imageUrl || null,
        schedule_type: formData.scheduleType,
        scheduled_for: formData.scheduledFor || null,
        recurring_schedule: formData.recurringSchedule,
        target_audience: formData.targetAudience,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification created successfully",
        className: "bg-green-50 border-green-200",
      });

      setFormData({
        title: "",
        message: "",
        imageUrl: "",
        scheduleType: "immediate",
        scheduledFor: "",
        recurringSchedule: null,
        targetAudience: { type: "all" },
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestNotification = async () => {
    if (!validateForm()) return;
    setIsTesting(true);

    try {
      const response = await supabase.functions.invoke('send-system-notification', {
        body: {
          type: 'test',
          variables: {
            title: formData.title,
            message: formData.message,
            image_url: formData.imageUrl,
          },
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Test Sent",
        description: "Test notification sent successfully",
        className: "bg-purple-50 border-purple-200",
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <Bell className="h-5 w-5 text-purple" />
            Create Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationBasicInfo
            title={formData.title}
            message={formData.message}
            imageUrl={formData.imageUrl}
            onTitleChange={(value) => setFormData({ ...formData, title: value })}
            onMessageChange={(value) => setFormData({ ...formData, message: value })}
            onImageUrlChange={(value) => setFormData({ ...formData, imageUrl: value })}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <NotificationScheduling
              scheduleType={formData.scheduleType}
              scheduledFor={formData.scheduledFor}
              recurringSchedule={formData.recurringSchedule}
              onScheduleTypeChange={(value) => setFormData({ ...formData, scheduleType: value })}
              onScheduledForChange={(value) => setFormData({ ...formData, scheduledFor: value })}
              onRecurringScheduleChange={(value) => setFormData({ ...formData, recurringSchedule: value })}
            />

            <NotificationTargeting
              targetAudience={formData.targetAudience}
              onTargetAudienceChange={(value) => setFormData({ ...formData, targetAudience: value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1 bg-purple hover:bg-purple/90"
            >
              {isSubmitting ? "Creating..." : "Create Notification"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isTesting}
              onClick={handleTestNotification}
              className="flex items-center gap-2 border-purple text-purple hover:bg-purple/10"
            >
              <Send className="h-4 w-4" />
              {isTesting ? "Sending..." : "Test Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};