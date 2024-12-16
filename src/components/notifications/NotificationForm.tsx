import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationBasicInfo } from "./NotificationBasicInfo";
import { NotificationScheduling } from "./NotificationScheduling";
import { NotificationTargeting } from "./NotificationTargeting";
import { NotificationErrorBoundary } from "./NotificationErrorBoundary";
import { Bell, Send } from "lucide-react";
import { notificationSchema, type NotificationFormData } from "./types";
import { useNotificationSubmit } from "./hooks/useNotificationSubmit";
import { useNotificationTest } from "./hooks/useNotificationTest";
import { useToast } from "@/hooks/use-toast";

export const NotificationForm = () => {
  const { toast } = useToast();
  const { isSubmitting, retryCount: submitRetryCount, submitNotification } = useNotificationSubmit();
  const { isTesting, retryCount: testRetryCount, testNotification } = useNotificationTest();
  
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    message: "",
    imageUrl: "",
    scheduleType: "immediate" as const,
    scheduledFor: "",
    recurringSchedule: null,
    targetAudience: { type: "all" },
  });

  const validateForm = () => {
    try {
      notificationSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Validation Error:", error);
        toast({
          title: "Validation Error",
          description: error.message,
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await submitNotification(formData);
  };

  const handleTestNotification = async () => {
    if (!validateForm()) return;
    await testNotification(formData);
  };

  return (
    <NotificationErrorBoundary>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <Bell className="h-5 w-5 text-purple" />
              Create Notification
              {(submitRetryCount > 0 || testRetryCount > 0) && (
                <span className="text-sm text-muted-foreground">
                  (Retry attempt {Math.max(submitRetryCount, testRetryCount)}/3)
                </span>
              )}
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
                onScheduleTypeChange={(value) => setFormData({ ...formData, scheduleType: value as "immediate" | "scheduled" | "recurring" })}
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
                {isSubmitting ? `${submitRetryCount > 0 ? 'Retrying...' : 'Creating...'}` : "Create Notification"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isTesting}
                onClick={handleTestNotification}
                className="flex items-center gap-2 border-purple text-purple hover:bg-purple/10"
              >
                <Send className="h-4 w-4" />
                {isTesting ? `${testRetryCount > 0 ? 'Retrying...' : 'Sending...'}` : "Test Send"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </NotificationErrorBoundary>
  );
};