import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ContentBlockFormValues } from "../types";
import { z } from "zod";

const idSchema = z.string().uuid("Invalid content block ID format");

export const useContentBlock = (id?: string) => {
  return useQuery({
    queryKey: ["content-block", id],
    queryFn: async () => {
      if (!id) throw new Error("Content block ID is required");
      
      // Validate ID format
      idSchema.parse(id);
      
      const { data, error } = await supabase
        .from("content_blocks")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching content block:", error);
        throw new Error(`Failed to fetch content block: ${error.message}`);
      }

      if (!data) {
        throw new Error("Content block not found");
      }

      return data as ContentBlockFormValues & { id: string };
    },
    enabled: !!id,
    retry: false,
  });
};