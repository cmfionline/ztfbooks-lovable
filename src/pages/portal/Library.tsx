import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Book } from "lucide-react";
import { BookDiscountBadge } from "@/components/books/components/BookDiscountBadge";

const PortalLibrary = () => {
  const { data: books } = useQuery({
    queryKey: ["user-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          reading_progress (current_page, total_pages)
        `)
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const isDiscountActive = (book: any) => {
    return book.discount_percentage && 
      book.discount_start_date && 
      book.discount_end_date &&
      new Date(book.discount_start_date) <= new Date() &&
      new Date(book.discount_end_date) >= new Date();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Library</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {books?.map((book) => {
          const coverImageUrl = book.cover_image 
            ? supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl
            : null;

          return (
            <Card key={book.id} className="p-4 relative">
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt={book.title}
                  className="aspect-[3/4] w-full object-cover rounded-md"
                />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted rounded-md">
                  <Book className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              {isDiscountActive(book) && (
                <BookDiscountBadge
                  originalPrice={book.price || 0}
                  discountPercentage={book.discount_percentage || 0}
                />
              )}
              <div className="mt-4">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {book.authors?.name}
                </p>
                {book.reading_progress?.[0] && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Progress: {Math.round((book.reading_progress[0].current_page / book.reading_progress[0].total_pages) * 100)}%
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PortalLibrary;