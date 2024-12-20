import { Book } from "@/types/book";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface BookCoverProps {
  book: Book;
}

export const BookCover = ({ book }: BookCoverProps) => {
  const coverUrl = book.cover_image
    ? supabase.storage.from("books").getPublicUrl(book.cover_image).data.publicUrl
    : null;

  return (
    <div className="relative">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`Cover of ${book.title}`}
          className="w-full rounded-lg shadow-lg"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">No cover available</span>
        </div>
      )}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {book.is_featured && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Featured
          </Badge>
        )}
        {book.is_top_selling && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Bestseller
          </Badge>
        )}
      </div>
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold">
          {book.is_free ? (
            <span className="text-green-600">Free</span>
          ) : (
            <PriceDisplay book={book} />
          )}
        </div>
      </div>
    </div>
  );
};

const PriceDisplay = ({ book }: { book: Book }) => {
  const isDiscounted = book.discount_percentage && 
    book.discount_start_date && 
    book.discount_end_date &&
    new Date(book.discount_start_date) <= new Date() &&
    new Date(book.discount_end_date) >= new Date();

  if (!isDiscounted) {
    return <span>{formatPrice(book.price)}</span>;
  }

  const discountedPrice = book.price - (book.price * (book.discount_percentage / 100));

  return (
    <div className="space-y-1">
      <div className="text-gray-500 line-through text-sm">
        {formatPrice(book.price)}
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-green-600">
          {formatPrice(discountedPrice)}
        </span>
        <span className="text-purple-600 text-sm">
          (-{book.discount_percentage}%)
        </span>
      </div>
    </div>
  );
};