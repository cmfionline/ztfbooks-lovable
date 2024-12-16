import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  NotificationFormData, 
  isNotificationResponse, 
  isErrorResponse,
  transformFormDataToDb 
} from "../types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const useNotificationSubmit = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const submitNotification = async (formData: NotificationFormData) => {
    setIsSubmitting(true);
    setRetryCount(0);

    const submitWithRetry = async (attempt: number = 0): Promise<void> => {
      try {
        const { data, error: supabaseError } = await supabase
          .from("notifications")
          .insert([transformFormDataToDb(formData)])
          .select()
          .single();

        if (supabaseError) throw supabaseError;

        if (isNotificationResponse(data)) {
          console.log("Notification created successfully:", data);
          toast({
            title: "Success",
            description: "Notification created successfully",
            className: "bg-green-50 border-green-200",
          });
          return;
        }
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * Math.pow(2, attempt));
          setRetryCount(attempt + 1);
          return submitWithRetry(attempt + 1);
        }

        const errorMessage = isErrorResponse(error) 
          ? error.message 
          : "Failed to create notification after multiple attempts";
        
        console.error("Final error:", errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    };

    await submitWithRetry();
  };

  return {
    isSubmitting,
    retryCount,
    submitNotification
  };
};