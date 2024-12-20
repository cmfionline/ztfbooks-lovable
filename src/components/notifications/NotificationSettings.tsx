import React, { useState, useEffect } from "react";
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
    queryKey: ["notification_templates", "onesignal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_templates")
        .select("*")
        .eq('type', 'system_update')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      setAppId(settings.app_id || "");
      setRestKey(settings.rest_key || "");
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from("notification_templates")
        .upsert({
          type: 'system_update',
          title_template: 'System Update',
          message_template: 'System has been updated',
          app_id: appId,
          rest_key: restKey
        })
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
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Settings className="h-5 w-5 text-purple" />
          OneSignal Settings
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Configure your OneSignal integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">App ID</Label>
          <Input
            placeholder="OneSignal App ID"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            className="border-purple-light focus:border-purple focus:ring-purple"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">REST API Key</Label>
          <Input
            type="password"
            placeholder="OneSignal REST API Key"
            value={restKey}
            onChange={(e) => setRestKey(e.target.value)}
            className="border-purple-light focus:border-purple focus:ring-purple"
          />
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={!appId || !restKey}
          className="w-full bg-purple hover:bg-purple/90 text-white"
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};