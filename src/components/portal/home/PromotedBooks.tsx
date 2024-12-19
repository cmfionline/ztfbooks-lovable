import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookCard } from "@/components/books/components/BookCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export const PromotedBooks = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const { data: promotedBooks } = useQuery({
    queryKey: ["promoted-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name)
        `)
        .eq("is_featured", true)
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  if (!promotedBooks?.length) return null;

  return (
    <section className="py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Special Offers</h2>
          <a href="#" className="text-sm text-purple hover:text-purple-dark">
            View all
          </a>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {promotedBooks.map((book) => (
              <CarouselItem key={book.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                <div className="h-full">
                  <BookCard
                    book={book}
                    aspectRatio="square"
                    width="full"
                    className="h-full"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};