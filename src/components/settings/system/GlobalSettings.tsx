import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface GlobalSettings {
  site_name: string;
  contact_email: string;
  support_phone: string;
}

export const GlobalSettings = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["globalSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("category", "global")
        .maybeSingle();
      
      if (error) throw error;
      const defaultSettings: GlobalSettings = {
        site_name: "",
        contact_email: "",
        support_phone: ""
      };
      return (data?.settings as Json as GlobalSettings) || defaultSettings;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
      <CardHeader>
        <CardTitle>Global Configuration</CardTitle>
        <CardDescription>Manage your global system settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            defaultValue={settings?.site_name}
            className="max-w-md"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supportEmail">Support Email</Label>
          <Input
            id="supportEmail"
            type="email"
            defaultValue={settings?.contact_email}
            className="max-w-md"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supportPhone">Support Phone</Label>
          <Input
            id="supportPhone"
            defaultValue={settings?.support_phone}
            className="max-w-md"
          />
        </div>
        <Button className="bg-purple hover:bg-purple-dark text-white">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};