import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useAdConfigurations = () => {
  const { data: adTypes, isLoading: isLoadingAdTypes } = useQuery({
    queryKey: ['adTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('type')
        .eq('is_active', true)
        .order('type');
      
      if (error) throw error;
      
      // Get unique types
      const uniqueTypes = Array.from(new Set(data.map(ad => ad.type)))
        .map(type => ({
          id: type,
          type,
          name: type.charAt(0).toUpperCase() + type.slice(1)
        }));
      
      return uniqueTypes;
    }
  });

  const { data: discountStrategies, isLoading: isLoadingDiscountStrategies } = useQuery({
    queryKey: ['discountTypes'],
    queryFn: async () => {
      // For now, return hardcoded values until we create the table
      return [
        { id: 'percentage', type: 'percentage', name: 'Percentage' },
        { id: 'fixed', type: 'fixed', name: 'Fixed Amount' },
        { id: 'volume', type: 'volume', name: 'Volume Discount' },
        { id: 'cart', type: 'cart', name: 'Cart Value Discount' }
      ];
    }
  });

  return {
    adTypes,
    discountStrategies,
    isLoading: isLoadingAdTypes || isLoadingDiscountStrategies
  };
};