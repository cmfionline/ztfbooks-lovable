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

export const TrendingBooks = () => {
  const { data: trendingBooks, isLoading } = useQuery({
    queryKey: ["trending-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="aspect-[2/3] w-1/2 h-[300px]" />
            <div className="grid grid-cols-2 gap-2 w-1/2">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="aspect-[2/3] h-[147px]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Group books into sets of 5 (1 large + 4 small)
  const groupedBooks = trendingBooks?.reduce((acc: any[], book, index) => {
    if (index % 5 === 0) {
      acc.push(trendingBooks.slice(index, index + 5));
    }
    return acc;
  }, []);

  const isDiscountActive = (book: any) => {
    return book.discount_percentage && 
      book.discount_start_date && 
      book.discount_end_date &&
      new Date(book.discount_start_date) <= new Date() &&
      new Date(book.discount_end_date) >= new Date();
  };

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2">
        {groupedBooks?.map((group, groupIndex) => (
          <CarouselItem key={groupIndex} className="pl-2 basis-full lg:basis-[49%]">
            <div className="flex gap-2">
              {/* Large featured book */}
              <Card className="w-1/2 group relative overflow-hidden">
                {group[0] && (
                  <>
                    {group[0].cover_image ? (
                      <img
                        src={supabase.storage.from('books').getPublicUrl(group[0].cover_image).data.publicUrl}
                        alt={group[0].title}
                        className="h-full w-full object-cover aspect-[2/3] transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted aspect-[2/3]">
                        <Book className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {isDiscountActive(group[0]) && (
                      <BookDiscountBadge
                        originalPrice={group[0].price || 0}
                        discountPercentage={group[0].discount_percentage || 0}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 p-2 text-white">
                        <h3 className="font-semibold text-sm line-clamp-2">{group[0].title}</h3>
                        <p className="text-xs text-white/80">by {group[0].authors?.name}</p>
                      </div>
                    </div>
                  </>
                )}
              </Card>

              {/* Grid of 4 smaller books */}
              <div className="grid grid-cols-2 gap-2 w-1/2">
                {group.slice(1).map((book) => (
                  <Card key={book.id} className="group relative overflow-hidden">
                    {book.cover_image ? (
                      <img
                        src={supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl}
                        alt={book.title}
                        className="h-full w-full object-cover aspect-[2/3] transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted aspect-[2/3]">
                        <Book className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    {isDiscountActive(book) && (
                      <BookDiscountBadge
                        originalPrice={book.price || 0}
                        discountPercentage={book.discount_percentage || 0}
                        className="scale-75 origin-top-right"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 p-1 text-white">
                        <h3 className="font-semibold text-xs line-clamp-1">{book.title}</h3>
                        <p className="text-[10px] text-white/80">by {book.authors?.name}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};