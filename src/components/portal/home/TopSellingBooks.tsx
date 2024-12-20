import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

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
        .limit(9);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {topSelling?.map((book, index) => {
        const coverUrl = book.cover_image
          ? supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl
          : null;

        return (
          <Card key={book.id} className="flex items-center gap-4 p-4 hover:shadow-lg transition-shadow duration-200">
            <span className="text-4xl font-bold text-muted w-12 text-center">{index + 1}</span>
            <div className="relative w-16 h-24 flex-shrink-0">
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-primary truncate">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.authors?.name}</p>
              <p className="text-sm font-medium mt-1">{formatPrice(book.price)}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};