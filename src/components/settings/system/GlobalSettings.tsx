import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { BasicInfoFields } from "./components/BasicInfoFields";
import { LogoUploadSection } from "./LogoUploadSection";
import { useLogoUpload } from "./hooks/useLogoUpload";
import type { GlobalSettingsData } from "./types";

const formSchema = z.object({
  site_name: z.string().min(2, "Site name must be at least 2 characters"),
  contact_email: z.string().email("Please enter a valid email"),
  support_phone: z.string().min(6, "Please enter a valid phone number"),
  logos: z.object({
    admin: z.string().nullable(),
    client: z.string().nullable(),
  }),
});

export const GlobalSettings = () => {
  const { toast } = useToast();
  const form = useForm<GlobalSettingsData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site_name: "",
      contact_email: "",
      support_phone: "",
      logos: {
        admin: null,
        client: null,
      },
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
      const defaultSettings: GlobalSettingsData = {
        site_name: "",
        contact_email: "",
        support_phone: "",
        logos: {
          admin: null,
          client: null,
        },
      };
      if (data) {
        const settings = data.settings as GlobalSettingsData;
        form.reset(settings);
        return settings;
      }
      return defaultSettings;
    },
  });

  const handleSubmit = async (values: GlobalSettingsData) => {
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

  const { uploadLogo, isUploading } = useLogoUpload((url, type) => {
    const currentSettings = settings || form.getValues();
    const updatedSettings = {
      ...currentSettings,
      logos: {
        ...currentSettings.logos,
        [type]: url
      }
    };
    form.reset(updatedSettings);
    handleSubmit(updatedSettings);
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
      <CardHeader className="pb-4">
        <CardTitle>Global Configuration</CardTitle>
        <CardDescription>Manage your global system settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicInfoFields form={form} />
            <div className="grid gap-4 md:grid-cols-2">
              <LogoUploadSection
                type="admin"
                logoUrl={settings?.logos?.admin}
                onUpload={uploadLogo}
              />
              <LogoUploadSection
                type="client"
                logoUrl={settings?.logos?.client}
                onUpload={uploadLogo}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-purple hover:bg-purple-dark text-white mt-4"
              disabled={form.formState.isSubmitting || !form.formState.isDirty || isUploading}
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