import { Book } from "@/types/book";
import { format } from "date-fns";
import { Book as BookIcon, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface BookMetadataDisplayProps {
  book: Book;
}

export const BookMetadataDisplay = ({ book }: BookMetadataDisplayProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
      
      <div className="flex items-center gap-2 text-gray-600">
        <User className="h-4 w-4" />
        <Link 
          to={`/books/authors/${book.author_id}`}
          className="hover:text-purple-600"
        >
          {book.authors?.name}
        </Link>
      </div>

      {book.series && (
        <div className="flex items-center gap-2 text-gray-600">
          <BookIcon className="h-4 w-4" />
          <Link 
            to={`/books/series/${book.series.id}`}
            className="hover:text-purple-600"
          >
            {book.series.name}
          </Link>
        </div>
      )}

      {book.synopsis && (
        <p className="text-gray-600 leading-relaxed">{book.synopsis}</p>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <MetadataItem label="Publisher">
          {book.publishers?.name || "Not specified"}
        </MetadataItem>
        
        <MetadataItem label="Language">
          {book.languages?.name || "Not specified"}
        </MetadataItem>
        
        <MetadataItem label="Publication Date">
          {book.publication_date 
            ? format(new Date(book.publication_date), "MMMM d, yyyy")
            : "Not specified"}
        </MetadataItem>
        
        <MetadataItem label="Pages">
          {book.page_count ? `${book.page_count} pages` : "Not specified"}
        </MetadataItem>
      </div>

      {book.books_tags && book.books_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <Tag className="h-4 w-4 text-gray-600" />
          {book.books_tags.map((bookTag) => (
            <Link
              key={bookTag.tag_id}
              to={`/books/tags/${bookTag.tag_id}`}
              className="text-sm px-3 py-1 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100"
            >
              {bookTag.tags?.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const MetadataItem = ({ 
  label, 
  children 
}: { 
  label: string; 
  children: React.ReactNode;
}) => (
  <div>
    <span className="block text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{children}</span>
  </div>
);