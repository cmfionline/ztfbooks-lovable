import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationBasicInfo } from "./NotificationBasicInfo";
import { NotificationScheduling } from "./NotificationScheduling";
import { NotificationTargeting } from "./NotificationTargeting";
import { NotificationErrorBoundary } from "./NotificationErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Send } from "lucide-react";
import { 
  notificationSchema, 
  type NotificationFormData,
  type NotificationResponse,
  isNotificationResponse,
  isErrorResponse,
  transformFormDataToDb
} from "./types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const NotificationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setRetryCount(0);

    const submitWithRetry = async (attempt: number = 0): Promise<void> => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .insert([transformFormDataToDb(formData)])
          .select()
          .single();

        if (error) throw error;

        if (isNotificationResponse(data)) {
          console.log("Notification created successfully:", data);
          toast({
            title: "Success",
            description: "Notification created successfully",
            className: "bg-green-50 border-green-200",
          });

          setFormData({
            title: "",
            message: "",
            imageUrl: "",
            scheduleType: "immediate" as const,
            scheduledFor: "",
            recurringSchedule: null,
            targetAudience: { type: "all" },
          });
        }
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * Math.pow(2, attempt)); // Exponential backoff
          setRetryCount(attempt + 1);
          return submitWithRetry(attempt + 1);
        }

        const errorMessage = isErrorResponse(error) 
          ? error.message 
          : "Failed to create notification after multiple attempts";
        
        console.error("Final error:", errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        if (attempt === MAX_RETRIES || !error) {
          setIsSubmitting(false);
        }
      }
    };

    await submitWithRetry();
  };

  const handleTestNotification = async () => {
    if (!validateForm()) return;
    setIsTesting(true);
    setRetryCount(0);

    const testWithRetry = async (attempt: number = 0): Promise<void> => {
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

        console.log("Test notification sent successfully");
        toast({
          title: "Test Sent",
          description: "Test notification sent successfully",
          className: "bg-purple-50 border-purple-200",
        });
      } catch (error) {
        console.error(`Test attempt ${attempt + 1} failed:`, error);

        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * Math.pow(2, attempt));
          setRetryCount(attempt + 1);
          return testWithRetry(attempt + 1);
        }

        const errorMessage = isErrorResponse(error) 
          ? error.message 
          : "Failed to send test notification after multiple attempts";

        console.error("Final test error:", errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        if (attempt === MAX_RETRIES || !error) {
          setIsTesting(false);
        }
      }
    };

    await testWithRetry();
  };

  return (
    <NotificationErrorBoundary>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <Bell className="h-5 w-5 text-purple" />
              Create Notification
              {retryCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  (Retry attempt {retryCount}/{MAX_RETRIES})
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
                {isSubmitting ? `${retryCount > 0 ? 'Retrying...' : 'Creating...'}` : "Create Notification"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isTesting}
                onClick={handleTestNotification}
                className="flex items-center gap-2 border-purple text-purple hover:bg-purple/10"
              >
                <Send className="h-4 w-4" />
                {isTesting ? `${retryCount > 0 ? 'Retrying...' : 'Sending...'}` : "Test Send"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </NotificationErrorBoundary>
  );
};