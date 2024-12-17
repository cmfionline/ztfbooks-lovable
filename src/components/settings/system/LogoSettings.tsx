import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";

interface LogoSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logos: {
    admin: string | null;
    client: string | null;
  };
}

export const LogoSettings = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ["logoSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("category", "branding")
        .maybeSingle();
      
      if (error) throw error;
      return (data?.settings as LogoSettings) || {
        colors: {
          primary: "#FDB813",
          secondary: "#1A1F2C",
          accent: "#8B5CF6"
        },
        logos: {
          admin: null,
          client: null
        }
      };
    },
  });

  const handleLogoUpload = async (file: File, type: 'admin' | 'client') => {
    try {
      setIsUploading(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Update settings
      const { error: updateError } = await supabase
        .from("system_settings")
        .update({
          settings: {
            ...settings,
            logos: {
              ...settings?.logos,
              [type]: publicUrl
            }
          }
        })
        .eq("category", "branding");

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Logo updated successfully",
        className: "bg-green-50 border-green-200",
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
      <CardHeader>
        <CardTitle>Logo Settings</CardTitle>
        <CardDescription>Configure your portal logos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminLogo">Admin Portal Logo</Label>
            <div className="flex items-center gap-4">
              {settings?.logos.admin && (
                <img 
                  src={settings.logos.admin} 
                  alt="Admin Logo" 
                  className="h-12 w-auto object-contain"
                />
              )}
              <div className="flex-1">
                <Input
                  id="adminLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file, 'admin');
                  }}
                  className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientLogo">Client Portal Logo</Label>
            <div className="flex items-center gap-4">
              {settings?.logos.client && (
                <img 
                  src={settings.logos.client} 
                  alt="Client Logo" 
                  className="h-12 w-auto object-contain"
                />
              )}
              <div className="flex-1">
                <Input
                  id="clientLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file, 'client');
                  }}
                  className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
                />
              </div>
            </div>
          </div>
        </div>

        {isUploading && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-purple" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};