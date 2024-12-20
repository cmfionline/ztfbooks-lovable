import { useQuery } from "@tanstack/react-query";
import { Book } from "@/types/book";
import { supabase } from "@/lib/supabase";
import { BookCover } from "./BookDetailPage/BookCover";
import { BookMetadataDisplay } from "./BookDetailPage/BookMetadataDisplay";
import { RelatedBooks } from "./BookDetailPage/RelatedBooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BookDetailPageProps {
  bookId: string;
}

export const BookDetailPage = ({ bookId }: BookDetailPageProps) => {
  const { data: book, isLoading, error } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (
            id,
            name,
            photo
          ),
          publishers (
            id,
            name
          ),
          series (
            id,
            name
          ),
          languages (
            id,
            name,
            code
          ),
          books_tags (
            tag_id,
            tags (
              id,
              name
            )
          )
        `)
        .eq("id", bookId)
        .single();

      if (error) throw error;
      return data as Book;
    },
  });

  if (isLoading) {
    return <BookDetailSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load book details</AlertDescription>
      </Alert>
    );
  }

  if (!book) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Book not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BookCover book={book} />
        <div className="md:col-span-2">
          <BookMetadataDisplay book={book} />
        </div>
      </div>
      <RelatedBooks book={book} />
    </div>
  );
};

const BookDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Skeleton className="h-[450px] w-full" />
      <div className="md:col-span-2 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  </div>
);