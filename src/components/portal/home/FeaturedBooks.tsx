import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
      {featuredBooks?.map((book) => {
        const coverUrl = book.cover_image
          ? supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl
          : null;

        return (
          <Card 
            key={book.id} 
            className="group relative overflow-hidden transition-all hover:scale-105"
          >
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 p-2 text-white">
                <h3 className="text-xs font-semibold line-clamp-2">{book.title}</h3>
                <p className="text-xs text-white/80">by {book.authors?.name}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};