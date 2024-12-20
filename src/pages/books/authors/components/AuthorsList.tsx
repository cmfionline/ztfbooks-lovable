import { Link } from "react-router-dom";
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Author } from "../types";

interface AuthorsListProps {
  authors: Author[];
  onDelete: (id: string) => Promise<void>;
}

export const AuthorsList = ({ authors, onDelete }: AuthorsListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">SR NO.</TableHead>
          <TableHead className="w-[100px]">PHOTO</TableHead>
          <TableHead>NAME</TableHead>
          <TableHead>NATIONALITY</TableHead>
          <TableHead>CONTACT</TableHead>
          <TableHead className="text-right">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {authors.map((author, index) => (
          <TableRow key={author.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Avatar className="w-10 h-10">
                <AvatarImage src={author.photo || ""} alt={author.name} />
                <AvatarFallback>
                  {author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{author.name}</TableCell>
            <TableCell>{author.nationality || "-"}</TableCell>
            <TableCell>{author.mobile || "-"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/books/authors/${author.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/books/authors/${author.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(author.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};