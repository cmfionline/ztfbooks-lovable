import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { adSchema, type AdFormValues } from "../schema";
import { addDays } from "date-fns";
import { useState, useEffect } from "react";

export const useAdForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const tomorrow = addDays(new Date(), 1);
  const fiveDaysLater = addDays(tomorrow, 5);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create or edit ads.",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  }, []);

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: "",
      type: "banner",
      placement: "home",
      content: "",
      cta_text: "Learn More",
      start_date: tomorrow.toISOString().split('T')[0],
      end_date: fiveDaysLater.toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: AdFormValues) => {
    try {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create or edit ads.",
          variant: "destructive",
        });
        return;
      }

      console.log("Submitting form with values:", values);
      let image_url = null;
      let video_url = null;

      if (values.image_file) {
        const file = values.image_file;
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('ads')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Image upload error:", uploadError);
          toast({
            title: "Error uploading image",
            description: uploadError.message,
            variant: "destructive",
          });
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('ads')
          .getPublicUrl(filePath);

        image_url = publicUrl;
      }

      if (values.video_file) {
        const file = values.video_file;
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('ads')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Video upload error:", uploadError);
          toast({
            title: "Error uploading video",
            description: uploadError.message,
            variant: "destructive",
          });
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('ads')
          .getPublicUrl(filePath);

        video_url = publicUrl;
      }

      // Remove file fields before sending to Supabase
      const { image_file, video_file, ...adData } = values;

      console.log("Sending data to Supabase:", { ...adData, image_url, video_url });
      const { error, data } = await supabase
        .from('ads')
        .insert([{
          ...adData,
          image_url,
          video_url,
          discount_strategy_id: values.discount_strategy_id || null,
        }]);

      if (error) {
        console.error("Supabase error:", error);
        toast({
          title: "Error creating ad",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("Ad created successfully:", data);
      toast({
        title: "Success",
        description: "The ad has been successfully created.",
      });

      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error('Error creating ad:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    isAuthenticated,
    onSubmit
  };
};