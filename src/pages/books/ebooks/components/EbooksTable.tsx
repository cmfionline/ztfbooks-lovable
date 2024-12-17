import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EbookTableRow } from "./EbookTableRow";
import type { Book } from "@/types/book";

interface EbooksTableProps {
  books: Book[];
  onToggleTopSelling: (id: string, status: boolean) => void;
  onToggleFeatured: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
}

export const EbooksTable = ({
  books,
  onToggleTopSelling,
  onToggleFeatured,
  onDelete,
}: EbooksTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Language</TableHead>
          <TableHead>Publisher</TableHead>
          <TableHead>Series</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books?.map((book, index) => (
          <EbookTableRow 
            key={book.id} 
            book={book} 
            index={index}
            onToggleTopSelling={onToggleTopSelling}
            onToggleFeatured={onToggleFeatured}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};