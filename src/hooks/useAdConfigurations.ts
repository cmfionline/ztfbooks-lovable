import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useAdConfigurations = () => {
  const { data: adTypes, isLoading } = useQuery({
    queryKey: ['adTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_types')
        .select('name, type, description, status')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
  });

  return {
    adTypes,
    isLoading,
  };
};