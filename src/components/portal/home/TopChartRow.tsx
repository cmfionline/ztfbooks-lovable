import { Book } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Book as BookType } from "@/types/book";

interface TopChartRowProps {
  book: BookType;
  index: number;
}

export const TopChartRow = ({ book, index }: TopChartRowProps) => {
  const coverUrl = book.cover_image
    ? supabase.storage.from("books").getPublicUrl(book.cover_image).data.publicUrl
    : null;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors rounded-lg">
      <span className="text-lg font-semibold text-gray-400 w-6">{index + 1}.</span>
      <div className="flex-shrink-0 w-16">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover rounded-md"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-muted rounded-md flex items-center justify-center">
            <Book className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link to={`/books/${book.id}`} className="hover:underline">
          <h3 className="font-medium text-primary line-clamp-1">{book.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">
          by {book.authors?.name}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(book.rating || 0) ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-sm text-muted-foreground ml-1">
            {book.rating?.toFixed(1) || "No ratings"}
          </span>
        </div>
      </div>
    </div>
  );
};