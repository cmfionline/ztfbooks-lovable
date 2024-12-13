import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotifySystemUpdate } from "@/components/notifications/NotifySystemUpdate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        setEmailNotifications(data.email_notifications);
        setPushNotifications(data.push_notifications);
        setMarketingEmails(data.marketing_emails);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          email_notifications: emailNotifications,
          push_notifications: pushNotifications,
          marketing_emails: marketingEmails,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="grid gap-6">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email & Push Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex-1">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="flex-1">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing-emails" className="flex-1">Marketing Emails</Label>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
                <Button 
                  onClick={handleSaveNotificationSettings}
                  className="w-full bg-purple hover:bg-purple/90"
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            <NotificationSettings />
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Your username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
                <Button className="w-full bg-purple hover:bg-purple/90">
                  Update Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Updates</CardTitle>
                <CardDescription>Recent system updates and improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <NotifySystemUpdate
                    updateTitle="Dark Mode Support"
                    updateDescription="We've added dark mode support across the entire platform"
                    updateType="feature"
                  />
                  <NotifySystemUpdate
                    updateTitle="Performance Improvements"
                    updateDescription="Enhanced loading speeds and responsiveness"
                    updateType="improvement"
                  />
                  <NotifySystemUpdate
                    updateTitle="Bug Fixes"
                    updateDescription="Fixed various minor issues reported by users"
                    updateType="fix"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;