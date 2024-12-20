import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TopChartRow } from "./TopChartRow";

export const EditorsPicksBooks = () => {
  const { data: books, isLoading } = useQuery({
    queryKey: ["editors-picks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          book_reviews (rating)
        `)
        .eq("is_featured", true)
        .limit(6);

      if (error) throw error;

      // Calculate average rating for each book
      return data.map(book => ({
        ...book,
        rating: book.book_reviews?.length 
          ? book.book_reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / book.book_reviews.length
          : null
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-[#141413]">Editors' Picks</h2>
            <p className="text-[#828179] mt-1">Our editors' picks, updated weekly.</p>
          </div>
          <Button variant="ghost" className="text-[#141413]">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {books?.map((book, index) => (
            <TopChartRow key={book.id} book={book} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};