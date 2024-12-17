import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  const { toast } = useToast();
  const coverImageUrl = book.cover_image 
    ? supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl
    : null;

  const handleFeaturedToggle = async () => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ is_featured: !book.is_featured })
        .eq('id', book.id);

      if (error) throw error;

      onToggleFeatured(book.id, !book.is_featured);
      
      toast({
        title: book.is_featured ? "Book unfeatured" : "Book featured",
        description: `${book.title} has been ${book.is_featured ? 'removed from' : 'added to'} featured books.`,
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <TableRow key={book.id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          {coverImageUrl ? (
            <img 
              src={coverImageUrl} 
              alt={`Cover of ${book.title}`}
              className="h-12 w-8 object-cover rounded"
            />
          ) : (
            <div className="h-12 w-8 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No cover</span>
            </div>
          )}
          <span>{book.title}</span>
        </div>
      </TableCell>
      <TableCell>{book.authors?.name || "N/A"}</TableCell>
      <TableCell>{book.languages?.name || "N/A"}</TableCell>
      <TableCell>{book.publishers?.name || "N/A"}</TableCell>
      <TableCell>{book.series?.name || "N/A"}</TableCell>
      <TableCell>{book.is_free ? "Free" : formatPrice(book.price)}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch
            checked={book.is_featured}
            onCheckedChange={handleFeaturedToggle}
          />
          <Star className={cn(
            "h-4 w-4",
            book.is_featured ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )} />
        </div>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            window.open(`/portal/library`, '_blank');
          }}
        >
          <Eye className="h-4 w-4" />
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