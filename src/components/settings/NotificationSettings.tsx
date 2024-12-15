import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { NotificationSettingsForm } from "./notifications/NotificationSettingsForm";
import { useNotificationSettings } from "./notifications/useNotificationSettings";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Error",
      description: "Something went wrong loading your settings. Please try again.",
      variant: "destructive",
    });
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Loading Settings</CardTitle>
        <CardDescription>
          We encountered a problem while loading your notification settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </CardContent>
    </Card>
  );
};

export const NotificationSettings = () => {
  const {
    emailNotifications,
    pushNotifications,
    marketingEmails,
    isSaving,
    isLoading,
    setEmailNotifications,
    setPushNotifications,
    setMarketingEmails,
    saveSettings,
  } = useNotificationSettings();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-purple" />
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Card>
        <CardHeader>
          <CardTitle>Email & Push Notifications</CardTitle>
          <CardDescription>
            Manage how you receive notifications and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationSettingsForm
            emailNotifications={emailNotifications}
            pushNotifications={pushNotifications}
            marketingEmails={marketingEmails}
            isSaving={isSaving}
            onEmailNotificationsChange={setEmailNotifications}
            onPushNotificationsChange={setPushNotifications}
            onMarketingEmailsChange={setMarketingEmails}
            onSave={saveSettings}
          />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};