import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Book } from "@/types/book";

export const useBook = (id?: string) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (
            id,
            name,
            photo
          ),
          languages (
            id,
            name,
            code
          ),
          publishers (
            id,
            name
          ),
          series (
            id,
            name
          ),
          books_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Book;
    },
    enabled: !!id,
  });
};