import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Book, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {trendingBooks?.map((book) => {
        const coverUrl = book.cover_image
          ? supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl
          : null;

        return (
          <Card key={book.id} className="group overflow-hidden">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={book.title}
                className="aspect-[2/3] w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center bg-muted">
                <Book className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold line-clamp-1">{book.title}</h3>
              <p className="text-sm text-muted-foreground">by {book.authors?.name}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};