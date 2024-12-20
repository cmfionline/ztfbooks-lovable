import { useQuery } from "@tanstack/react-query";
import { Book } from "@/types/book";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";

interface RelatedBooksProps {
  book: Book;
}

export const RelatedBooks = ({ book }: RelatedBooksProps) => {
  const { data: authorBooks } = useQuery({
    queryKey: ["author-books", book.author_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("books")
        .select("*")
        .eq("author_id", book.author_id)
        .neq("id", book.id)
        .limit(4);
      return data;
    },
  });

  const { data: seriesBooks } = useQuery({
    queryKey: ["series-books", book.series_id],
    queryFn: async () => {
      if (!book.series_id) return null;
      const { data } = await supabase
        .from("books")
        .select("*")
        .eq("series_id", book.series_id)
        .neq("id", book.id)
        .limit(4);
      return data;
    },
    enabled: !!book.series_id,
  });

  const { data: relatedBooks } = useQuery({
    queryKey: ["related-books", book.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("books")
        .select("*")
        .neq("id", book.id)
        .limit(4);
      return data;
    },
  });

  return (
    <div className="mt-16 space-y-12">
      {authorBooks && authorBooks.length > 0 && (
        <RelatedSection
          title={`More from ${book.authors?.name}`}
          books={authorBooks}
        />
      )}

      {seriesBooks && seriesBooks.length > 0 && (
        <RelatedSection
          title={`More from ${book.series?.name}`}
          books={seriesBooks}
        />
      )}

      {relatedBooks && relatedBooks.length > 0 && (
        <RelatedSection
          title="Customers Also Bought"
          books={relatedBooks}
        />
      )}
    </div>
  );
};

const RelatedSection = ({ 
  title, 
  books 
}: { 
  title: string; 
  books: Book[];
}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {books.map((book) => (
        <Link
          key={book.id}
          to={`/books/${book.id}`}
          className="group"
        >
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
            {book.cover_image ? (
              <img
                src={supabase.storage.from("books").getPublicUrl(book.cover_image).data.publicUrl}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No cover</span>
              </div>
            )}
          </div>
          <div className="mt-2">
            <h3 className="font-medium text-gray-900 group-hover:text-purple-600 truncate">
              {book.title}
            </h3>
            <p className="text-sm text-gray-500">
              {book.is_free ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(book.price)
              )}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);