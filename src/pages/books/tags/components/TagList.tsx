import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface TagListProps {
  paginatedTags: any[];
  handleDelete: (id: string) => void;
}

export const TagList = ({ paginatedTags, handleDelete }: TagListProps) => {
  return (
    <TableBody>
      {paginatedTags.map((tag) => (
        <TableRow key={tag.id}>
          <TableCell className="font-medium">{tag.name}</TableCell>
          <TableCell>
            {tag.created_at && new Date(tag.created_at).toString() !== "Invalid Date"
              ? format(new Date(tag.created_at), "PPP")
              : "N/A"}
          </TableCell>
          <TableCell className="text-right space-x-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link to={`/books/tags/${tag.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link to={`/books/tags/edit/${tag.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(tag.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};