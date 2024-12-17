import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  site_name: z.string().min(2, "Site name must be at least 2 characters"),
  contact_email: z.string().email("Please enter a valid email"),
  support_phone: z.string().min(6, "Please enter a valid phone number"),
});

type GlobalSettings = z.infer<typeof formSchema>;

export const GlobalSettings = () => {
  const { toast } = useToast();
  const form = useForm<GlobalSettings>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site_name: "",
      contact_email: "",
      support_phone: "",
    },
  });

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
      if (data) {
        const settings = data.settings as unknown as GlobalSettings;
        form.reset(settings);
        return settings;
      }
      return defaultSettings;
    },
  });

  const handleSubmit = async (values: GlobalSettings) => {
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
          category: "global",
          settings: values,
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
    } catch (error: any) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update global settings",
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = async (file: File, type: 'admin' | 'client') => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload logos",
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
          description: "You don't have permission to upload logos",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      const currentSettings = settings || {};
      const updatedSettings = {
        ...currentSettings,
        logos: {
          ...currentSettings.logos,
          [type]: publicUrl
        }
      };

      const { error: updateError } = await supabase
        .from("system_settings")
        .upsert({
          category: "global",
          settings: updatedSettings,
        }, {
          onConflict: "category"
        });

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `${type} logo uploaded successfully`,
        className: "bg-green-50 border-green-200",
      });
      refetch();
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="site_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="support_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Phone</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div>
                <FormLabel>Admin Portal Logo</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file, 'admin');
                  }}
                  className="max-w-md border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
                />
                {settings?.logos?.admin && (
                  <img 
                    src={settings.logos.admin} 
                    alt="Admin Logo" 
                    className="h-12 w-auto object-contain mt-2"
                  />
                )}
              </div>
              <div>
                <FormLabel>Client Portal Logo</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file, 'client');
                  }}
                  className="max-w-md border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
                />
                {settings?.logos?.client && (
                  <img 
                    src={settings.logos.client} 
                    alt="Client Logo" 
                    className="h-12 w-auto object-contain mt-2"
                  />
                )}
              </div>
            </div>
            <Button 
              type="submit" 
              className="bg-purple hover:bg-purple-dark text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};