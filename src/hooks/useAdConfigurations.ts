import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useAdConfigurations = () => {
  const { data: adTypes, isLoading: isLoadingAdTypes } = useQuery({
    queryKey: ['adTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_types')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: discountStrategies, isLoading: isLoadingDiscountStrategies } = useQuery({
    queryKey: ['discountStrategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_strategies')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  return {
    adTypes,
    discountStrategies,
    isLoading: isLoadingAdTypes || isLoadingDiscountStrategies
  };
};