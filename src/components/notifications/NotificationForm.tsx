import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationBasicInfo } from "./NotificationBasicInfo";
import { NotificationScheduling } from "./NotificationScheduling";
import { NotificationTargeting } from "./NotificationTargeting";
import { supabase } from "@/integrations/supabase/client";

export const NotificationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    imageUrl: "",
    scheduleType: "immediate",
    scheduledFor: "",
    recurringSchedule: null,
    targetAudience: { type: "all" },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      });

      // Reset form
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <NotificationBasicInfo
            title={formData.title}
            message={formData.message}
            imageUrl={formData.imageUrl}
            onTitleChange={(value) => setFormData({ ...formData, title: value })}
            onMessageChange={(value) => setFormData({ ...formData, message: value })}
            onImageUrlChange={(value) => setFormData({ ...formData, imageUrl: value })}
          />

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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Notification"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};