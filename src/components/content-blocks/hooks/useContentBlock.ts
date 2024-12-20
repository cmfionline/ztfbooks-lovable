import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ContentBlockFormValues } from "../types";

export const useContentBlock = (id?: string) => {
  return useQuery({
    queryKey: ["content-block", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("content_blocks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as ContentBlockFormValues & { id: string };
    },
    enabled: !!id,
  });
};