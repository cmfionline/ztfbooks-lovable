import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ReportSettings } from "@/components/settings/ReportSettings";

const Settings = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="grid gap-6">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="reports">
            <ReportSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;