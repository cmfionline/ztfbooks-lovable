import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useAuthor = (id?: string) => {
  return useQuery({
    queryKey: ["author", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};