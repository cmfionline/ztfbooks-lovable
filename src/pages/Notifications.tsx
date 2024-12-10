import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationForm } from "@/components/notifications/NotificationForm";
import { NotificationHistory } from "@/components/notifications/NotificationHistory";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";

export const NotificationsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="send">
        <TabsList>
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <NotificationForm />
        </TabsContent>

        <TabsContent value="history">
          <NotificationHistory />
        </TabsContent>

        <TabsContent value="settings">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;