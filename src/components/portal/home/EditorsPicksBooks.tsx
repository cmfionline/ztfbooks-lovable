import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookCard } from "@/components/books/components/BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const EditorsPicksBooks = () => {
  const { data: books, isLoading } = useQuery({
    queryKey: ["editors-picks"],
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books?.map((book) => (
            <div key={book.id} className="flex gap-6 p-6 bg-[#FAFAF8] rounded-lg">
              <div className="w-32 flex-shrink-0">
                <BookCard book={book} className="h-full" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-[#141413] mb-2">{book.title}</h3>
                <p className="text-[#828179] text-sm mb-4">{book.authors?.name}</p>
                <p className="text-[#605F5B] text-sm line-clamp-3">{book.synopsis}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};