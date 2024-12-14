import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface LanguageSettings {
  default: string;
  supported: string[];
}

export const LanguageSettings = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["languageSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("category", "language")
        .maybeSingle();
      
      if (error) throw error;
      const defaultSettings: LanguageSettings = {
        default: "en",
        supported: ["en"]
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
        <CardTitle>Language Settings</CardTitle>
        <CardDescription>Configure your language preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="defaultLanguage">Default Language</Label>
          <Select defaultValue={settings?.default}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {settings?.supported.map((lang: string) => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-purple hover:bg-purple-dark text-white">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};