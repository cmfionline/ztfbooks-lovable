import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookDiscountBadge } from "@/components/books/components/BookDiscountBadge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
        {[...Array(5)].map((_, i) => (
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
        {discountedBooks?.map((book) => {
          const coverUrl = book.cover_image
            ? supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl
            : null;

          return (
            <CarouselItem key={book.id} className="pl-2 md:pl-3 basis-1/3 md:basis-1/4 lg:basis-1/8">
              <Card className="group relative overflow-hidden transition-all hover:scale-105">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={book.title}
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center bg-muted">
                    <Book className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <BookDiscountBadge
                  originalPrice={book.price}
                  discountPercentage={book.discount_percentage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-2 text-white">
                    <h3 className="text-xs font-semibold line-clamp-2">{book.title}</h3>
                    <p className="text-xs text-white/80">by {book.authors?.name}</p>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};