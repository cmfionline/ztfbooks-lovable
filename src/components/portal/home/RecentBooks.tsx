import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Book, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RecentBooks = () => {
  const { data: recentBooks, isLoading } = useQuery({
    queryKey: ["recent-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {recentBooks?.map((book) => {
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
                <Book className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 p-4 text-white">
                <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                <p className="text-sm text-white/80">by {book.authors?.name}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};