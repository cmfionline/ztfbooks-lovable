import { useState } from "react";
import { Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [appId, setAppId] = useState("");
  const [restKey, setRestKey] = useState("");

  const { data: settings, refetch: refetchSettings } = useQuery({
    queryKey: ["notification_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  // Set initial values when settings are loaded
  React.useEffect(() => {
    if (settings) {
      setAppId(settings.app_id);
      setRestKey(settings.rest_key);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from("notification_settings")
        .upsert({ app_id: appId, rest_key: restKey })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });

      refetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          OneSignal Settings
        </CardTitle>
        <CardDescription>
          Configure your OneSignal integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>App ID</Label>
          <Input
            placeholder="OneSignal App ID"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>REST API Key</Label>
          <Input
            type="password"
            placeholder="OneSignal REST API Key"
            value={restKey}
            onChange={(e) => setRestKey(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={!appId || !restKey}
          className="w-full"
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};