import { Book as BookIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { BookDiscountBadge } from "./BookDiscountBadge";
import { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  aspectRatio?: "portrait" | "square";
  width?: string;
  showAuthor?: boolean;
  className?: string;
}

export const BookCard = ({
  book,
  aspectRatio = "portrait",
  width = "full",
  showAuthor = true,
  className = "",
}: BookCardProps) => {
  const coverUrl = book.cover_image
    ? supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl
    : null;

  const isDiscountActive = book.discount_percentage && 
    book.discount_start_date && 
    book.discount_end_date &&
    new Date(book.discount_start_date) <= new Date() &&
    new Date(book.discount_end_date) >= new Date();

  return (
    <Card 
      className={`group relative overflow-hidden transition-all hover:scale-105 ${className}`}
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={book.title}
          className={`w-${width} object-cover ${
            aspectRatio === "portrait" ? "aspect-[2/3]" : "aspect-square"
          }`}
        />
      ) : (
        <div className={`flex w-${width} items-center justify-center bg-muted ${
          aspectRatio === "portrait" ? "aspect-[2/3]" : "aspect-square"
        }`}>
          <BookIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      {isDiscountActive && (
        <BookDiscountBadge
          originalPrice={book.price || 0}
          discountPercentage={book.discount_percentage || 0}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-2 text-white">
          <h3 className="text-xs font-semibold line-clamp-2">{book.title}</h3>
          {showAuthor && (
            <p className="text-xs text-white/80">by {book.authors?.name}</p>
          )}
        </div>
      </div>
    </Card>
  );
};