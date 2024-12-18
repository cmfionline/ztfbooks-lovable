import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="grid grid-cols-1 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="aspect-[3/4] w-1/2" />
            <div className="grid grid-cols-2 gap-4 w-1/2">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="aspect-[3/4]" />
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

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {groupedBooks?.map((group, groupIndex) => (
          <CarouselItem key={groupIndex} className="pl-4 basis-full lg:basis-[98%]">
            <div className="flex gap-4">
              {/* Large featured book */}
              <Card className="w-1/2 group relative overflow-hidden">
                {group[0] && (
                  <>
                    {group[0].cover_image ? (
                      <img
                        src={supabase.storage.from('books').getPublicUrl(group[0].cover_image).data.publicUrl}
                        alt={group[0].title}
                        className="aspect-[3/4] w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted">
                        <Book className="h-20 w-20 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 p-4 text-white">
                        <h3 className="font-semibold text-xl line-clamp-2">{group[0].title}</h3>
                        <p className="text-white/80">by {group[0].authors?.name}</p>
                      </div>
                    </div>
                  </>
                )}
              </Card>

              {/* Grid of 4 smaller books */}
              <div className="grid grid-cols-2 gap-4 w-1/2">
                {group.slice(1).map((book) => (
                  <Card key={book.id} className="group relative overflow-hidden">
                    {book.cover_image ? (
                      <img
                        src={supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl}
                        alt={book.title}
                        className="aspect-[3/4] w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted">
                        <Book className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 p-4 text-white">
                        <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                        <p className="text-sm text-white/80">by {book.authors?.name}</p>
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