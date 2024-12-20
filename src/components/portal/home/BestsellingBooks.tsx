import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookCard } from "@/components/books/components/BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const BestsellingBooks = () => {
  const { data: books, isLoading } = useQuery({
    queryKey: ["bestselling-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          languages (name)
        `)
        .eq("is_top_selling", true)
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-[#141413]">Bestselling Books</h2>
            <p className="text-[#828179] mt-1">The books everyone's reading right now.</p>
          </div>
          <Button variant="ghost" className="text-[#141413]">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {books?.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};