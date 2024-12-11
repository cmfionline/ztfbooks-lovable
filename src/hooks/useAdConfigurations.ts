import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useAdConfigurations = () => {
  const { data: adTypes, isLoading: isLoadingAdTypes } = useQuery({
    queryKey: ['adTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_types')
        .select('name, type, description, status')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching ad types:', error);
        return [];
      }
      return data;
    },
  });

  const { data: discountStrategies, isLoading: isLoadingDiscountStrategies } = useQuery({
    queryKey: ['discountTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_strategies')
        .select('id, type, name')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching discount strategies:', error);
        // Fallback to hardcoded values if table doesn't exist or error occurs
        return [
          { id: 'percentage', type: 'percentage', name: 'Percentage' },
          { id: 'fixed', type: 'fixed', name: 'Fixed Amount' },
          { id: 'volume', type: 'volume', name: 'Volume Discount' },
          { id: 'cart', type: 'cart', name: 'Cart Value Discount' }
        ];
      }
      
      return data;
    },
  });

  return {
    adTypes: adTypes || [],
    discountStrategies: discountStrategies || [],
    isLoading: isLoadingAdTypes || isLoadingDiscountStrategies
  };
};