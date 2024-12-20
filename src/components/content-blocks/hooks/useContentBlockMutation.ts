import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ContentBlockFormValues } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useContentBlockMutation = (id?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ContentBlockFormValues) => {
      if (id) {
        const { data, error } = await supabase
          .from("content_blocks")
          .update(values)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("content_blocks")
          .insert([values])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-blocks"] });
      toast({
        title: "Success",
        description: `Content block ${id ? "updated" : "created"} successfully`,
      });
    },
    onError: (error: Error) => {
      console.error("Content block mutation error:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${id ? "update" : "create"} content block`,
        variant: "destructive",
      });
    },
  });
};