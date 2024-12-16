import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Book } from "@/types/book";

export const useEbooksData = () => {
  const { toast } = useToast();

  return useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (
            id,
            name
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
          )
        `)
        .order('title');

      if (error) {
        console.error("Error fetching books:", error);
        toast({
          variant: "destructive",
          title: "Error fetching books",
          description: error.message,
        });
        return [];
      }

      return data || [];
    },
  });
};