import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { getAllLanguages, formatLanguageLabel } from "@/utils/languages";
import { useQuery } from "@tanstack/react-query";

export const LanguageSettings = () => {
  const { toast } = useToast();
  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ["languageSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("category", "language")
        .maybeSingle();
      
      if (error) throw error;
      const defaultSettings = {
        default: "en",
        supported: ["en"]
      };
      return data ? data.settings : defaultSettings;
    },
  });

  const handleSave = async (value: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Error",
          description: "You must be logged in to update settings",
          variant: "destructive",
        });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.user.id)
        .single();

      if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        toast({
          title: "Error",
          description: "You don't have permission to update settings",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("system_settings")
        .upsert({
          category: "language",
          settings: {
            ...settings,
            default: value
          }
        }, {
          onConflict: "category"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Language settings updated successfully",
        className: "bg-green-50 border-green-200",
      });
      refetch();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update language settings",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const availableLanguages = getAllLanguages();

  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
      <CardHeader>
        <CardTitle>Language Settings</CardTitle>
        <CardDescription>Configure your language preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="defaultLanguage">Default Language</Label>
          <Select 
            defaultValue={settings?.default}
            onValueChange={handleSave}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {formatLanguageLabel(lang.name, lang.code)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};