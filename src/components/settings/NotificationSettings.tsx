import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
}

const validateSettings = (settings: NotificationSettings): boolean => {
  return (
    typeof settings.email_notifications === 'boolean' &&
    typeof settings.push_notifications === 'boolean' &&
    typeof settings.marketing_emails === 'boolean'
  );
};

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
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Authentication Error",
            description: "Please sign in to view your settings.",
            variant: "destructive",
          });
          return;
        }

        const { data: settings, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (settings) {
          if (!validateSettings(settings)) {
            throw new Error('Invalid settings data received');
          }
          setEmailNotifications(settings.email_notifications);
          setPushNotifications(settings.push_notifications);
          setMarketingEmails(settings.marketing_emails);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: "Error Loading Settings",
          description: "Your settings could not be loaded. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSaveNotificationSettings = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to save your settings.",
          variant: "destructive",
        });
        return;
      }

      const settings = {
        user_id: user.id,
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        marketing_emails: marketingEmails,
      };

      if (!validateSettings(settings)) {
        throw new Error('Invalid settings data');
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert(settings);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated successfully.",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save Failed",
        description: "We couldn't save your settings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex-1">
              Email Notifications
              <p className="text-sm text-muted-foreground">
                Receive important updates and notifications via email
              </p>
            </Label>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex-1">
              Push Notifications
              <p className="text-sm text-muted-foreground">
                Get instant notifications on your device
              </p>
            </Label>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-emails" className="flex-1">
              Marketing Emails
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </Label>
            <Switch
              id="marketing-emails"
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
            />
          </div>
          <Button 
            onClick={handleSaveNotificationSettings}
            disabled={isSaving}
            className="w-full bg-purple hover:bg-purple/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};