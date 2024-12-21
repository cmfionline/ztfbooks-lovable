import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Voucher } from "../types";

const ITEMS_PER_PAGE = 10;

export const useVoucherData = (clientId: string, page: number = 1) => {
  return useQuery({
    queryKey: ['client-vouchers', clientId, page],
    queryFn: async () => {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('vouchers')
        .select(`
          *,
          books:voucher_books(
            book:books(
              title
            )
          ),
          series:voucher_series(
            series:series(
              name
            )
          )
        `, { count: 'exact' })
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .range(start, end);
      
      if (error) {
        toast.error("Error fetching vouchers: " + error.message);
        throw error;
      }

      return {
        vouchers: data as Voucher[],
        totalCount: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    placeholderData: (previousData) => previousData // Use this instead of keepPreviousData
  });
};