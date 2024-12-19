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
import AutoPlay from "embla-carousel-autoplay";
import { useRef } from "react";

export const PromotedBooks = () => {
  const plugin = useRef(
    AutoPlay({ delay: 4000, stopOnInteraction: true })
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
          <CarouselItem key={book.id} className="pl-2 md:pl-4 basis-full sm:basis-1/3">
            <BookCard
              book={book}
              aspectRatio="portrait"
              width="full"
              className="h-full"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};