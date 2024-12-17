import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useLogoUpload = (onSuccess: (url: string, type: 'admin' | 'client') => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadLogo = async (file: File, type: 'admin' | 'client') => {
    try {
      setIsUploading(true);
      
      // Check user permissions
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to upload logos");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        throw new Error("You don't have permission to upload logos");
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      onSuccess(publicUrl, type);
      
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
        className: "bg-green-50 border-green-200",
      });
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadLogo, isUploading };
};