import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCard } from "@/components/books/components/BookCard";

export const FeaturedBooks = () => {
  const { data: featuredBooks, isLoading } = useQuery({
    queryKey: ["featured-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          languages (name)
        `)
        .eq("is_featured", true)
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {featuredBooks?.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};