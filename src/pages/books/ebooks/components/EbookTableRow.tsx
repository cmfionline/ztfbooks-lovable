import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";

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
    <TableRow key={book.id}>
      <TableCell>{book.title}</TableCell>
      <TableCell>{book.authors?.name || "N/A"}</TableCell>
      <TableCell>{book.languages?.name || "N/A"}</TableCell>
      <TableCell>{book.publishers?.name || "N/A"}</TableCell>
      <TableCell>{book.series?.name || "N/A"}</TableCell>
      <TableCell>{book.is_free ? "Free" : formatPrice(book.price)}</TableCell>
      <TableCell className="text-right space-x-2">
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
      </TableCell>
    </TableRow>
  );
};