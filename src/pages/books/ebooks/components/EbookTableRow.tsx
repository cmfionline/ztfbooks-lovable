import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, Link as LinkIcon, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface EbookTableRowProps {
  book: Book;
  index: number;
  onToggleTopSelling: (id: string, currentStatus: boolean) => void;
  onToggleFeatured: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export const EbookTableRow = ({
  book,
  index,
  onToggleTopSelling,
  onToggleFeatured,
  onDelete,
}: EbookTableRowProps) => {
  return (
    <tr key={book.id}>
      <td className="p-4">{index + 1}</td>
      <td className="p-4">
        {book.cover_image ? (
          <img 
            src={book.cover_image} 
            alt={book.title}
            className="w-16 h-20 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
            No Image
          </div>
        )}
      </td>
      <td className="p-4 font-medium">{book.title}</td>
      <td className="p-4">{book.authors?.name || "N/A"}</td>
      <td className="p-4">{book.series?.name || "N/A"}</td>
      <td className="p-4">
        <Switch
          checked={book.is_top_selling || false}
          onCheckedChange={() => onToggleTopSelling(book.id, book.is_top_selling || false)}
        />
      </td>
      <td className="p-4">
        <Switch
          checked={book.is_featured || false}
          onCheckedChange={() => onToggleFeatured(book.id, book.is_featured || false)}
        />
      </td>
      <td className="p-4 text-right space-x-2">
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <Link to={`/books/${book.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <Link to={`/books/${book.id}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(book.id)}
          className="hover:bg-red-50 text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};