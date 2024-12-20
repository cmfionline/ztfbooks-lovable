import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { BookLoadingState } from "@/components/books/BookLoadingState";
import { Book } from "@/types/book";

const BestSellingBooks = () => {
  const { data: books, isLoading, error } = useQuery<Book[]>({
    queryKey: ['best-selling-books'],
    queryFn: async ({ signal }) => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select(`
            id,
            title,
            price,
            authors (
              name
            )
          `)
          .eq('is_top_selling', true)
          .limit(5)
          .abortSignal(signal);

        if (error) {
          console.error('Error fetching best selling books:', error);
          throw error;
        }
        
        // Transform the data to match our Book interface
        return (data || []).map(book => ({
          ...book,
          authors: book.authors?.[0] || { name: 'Unknown Author' }
        })) as Book[];
      } catch (error: any) {
        console.error('Error:', error);
        throw new Error(error.message);
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (error) {
    toast({
      title: "Error loading best sellers",
      description: "Failed to load best selling books. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Best Selling Books</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <BookLoadingState />
        ) : books?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No best selling books found.</p>
        ) : (
          <div className="space-y-4">
            {books?.map((book) => (
              <div key={book.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{book.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {book.authors?.name}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  ${book.price?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BestSellingBooks;