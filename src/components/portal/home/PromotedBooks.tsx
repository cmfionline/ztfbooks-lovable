import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { PromotionalBanner } from "./PromotionalBanner";

export const PromotedBooks = () => {
  const { data: promotedBooks, isLoading } = useQuery({
    queryKey: ["promoted-books"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name)
        `)
        .not('discount_percentage', 'is', null)
        .gte('discount_end_date', now)
        .lte('discount_start_date', now)
        .order('discount_percentage', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {promotedBooks?.map((book) => (
        <PromotionalBanner key={book.id} book={book} />
      ))}
    </div>
  );
};