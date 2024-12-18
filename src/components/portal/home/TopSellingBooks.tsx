import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TopSellingBooks = () => {
  const { data: topSelling, isLoading } = useQuery({
    queryKey: ["top-selling"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (
            id,
            name
          )
        `)
        .eq("is_top_selling", true)
        .limit(10); // Increased from 6 to 10 books

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => ( // Updated skeleton count to match new limit
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topSelling?.map((book, index) => {
        const coverUrl = book.cover_image
          ? supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl
          : null;

        return (
          <div key={book.id} className="flex items-center gap-4 p-4 hover:bg-accent rounded-lg transition-colors">
            <span className="text-3xl font-bold text-muted-foreground w-8">{index + 1}</span>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={book.title}
                className="h-24 w-16 object-cover rounded"
              />
            ) : (
              <div className="flex h-24 w-16 items-center justify-center bg-muted rounded">
                <Book className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-muted-foreground">by {book.authors?.name}</p>
              <p className="text-sm font-medium mt-1">${book.price?.toFixed(2)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};