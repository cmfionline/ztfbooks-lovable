import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotificationFormData, isErrorResponse } from "../types";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useNotificationTest = () => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const testNotification = async (formData: NotificationFormData) => {
    setIsTesting(true);
    setRetryCount(0);

    const testWithRetry = async (attempt: number = 0): Promise<void> => {
      try {
        const { error: functionError } = await supabase.functions.invoke('send-system-notification', {
          body: {
            type: 'test',
            variables: {
              title: formData.title,
              message: formData.message,
              image_url: formData.imageUrl,
            },
          },
        });

        if (functionError) throw functionError;

        console.log("Test notification sent successfully");
        toast({
          title: "Test Sent",
          description: "Test notification sent successfully",
          className: "bg-purple-50 border-purple-200",
        });
      } catch (error) {
        console.error(`Test attempt ${attempt + 1} failed:`, error);

        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * Math.pow(2, attempt));
          setRetryCount(attempt + 1);
          return testWithRetry(attempt + 1);
        }

        const errorMessage = isErrorResponse(error) 
          ? error.message 
          : "Failed to send test notification after multiple attempts";

        console.error("Final test error:", errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsTesting(false);
      }
    };

    await testWithRetry();
  };

  return {
    isTesting,
    retryCount,
    testNotification
  };
};