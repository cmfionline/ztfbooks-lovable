import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Site Name</label>
                <Input defaultValue="ZTF Books" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Site Description</label>
                <Textarea 
                  defaultValue="Your one-stop shop for digital books and publications"
                  className="mt-1"
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Support Email</label>
                <Input defaultValue="support@ztfbooks.com" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Email Footer Text</label>
                <Textarea 
                  defaultValue="Thank you for choosing ZTF Books"
                  className="mt-1"
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">API Key</label>
                <Input defaultValue="••••••••••••••••" type="password" className="mt-1" />
              </div>
              <Button variant="outline">Generate New Key</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;