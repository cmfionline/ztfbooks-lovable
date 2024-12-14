import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

interface GlobalSettings {
  site_name: string;
  contact_email: string;
  support_phone: string;
}

export const GlobalSettings = () => {
  const { toast } = useToast();
  const { data: settings, isLoading, refetch } = useQuery({
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedSettings = {
      site_name: formData.get("siteName"),
      contact_email: formData.get("supportEmail"),
      support_phone: formData.get("supportPhone"),
    };

    try {
      const { error } = await supabase
        .from("system_settings")
        .upsert({
          category: "global",
          settings: updatedSettings,
        }, {
          onConflict: "category"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Global settings updated successfully",
        className: "bg-green-50 border-green-200",
      });
      refetch();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update global settings",
        variant: "destructive",
      });
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              name="siteName"
              defaultValue={settings?.site_name}
              className="max-w-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              name="supportEmail"
              type="email"
              defaultValue={settings?.contact_email}
              className="max-w-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportPhone">Support Phone</Label>
            <Input
              id="supportPhone"
              name="supportPhone"
              defaultValue={settings?.support_phone}
              className="max-w-md"
            />
          </div>
          <Button type="submit" className="bg-purple hover:bg-purple-dark text-white">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};