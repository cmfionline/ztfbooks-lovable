import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useProfile = (id?: string) => {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_settings (*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};