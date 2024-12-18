import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCard } from "@/components/books/components/BookCard";

export const HotDiscounts = () => {
  const { data: discountedBooks, isLoading } = useQuery({
    queryKey: ["discounted-books"],
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
        .order('discount_percentage', { ascending: false })
        .limit(10);

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
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-3">
        {discountedBooks?.map((book) => (
          <CarouselItem key={book.id} className="pl-2 md:pl-3 basis-1/3 md:basis-1/4 lg:basis-1/6">
            <BookCard book={book} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};