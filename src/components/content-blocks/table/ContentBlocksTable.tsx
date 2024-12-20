import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteContentBlockDialog } from "./DeleteContentBlockDialog";
import { useNavigate } from "react-router-dom";

interface ContentBlocksTableProps {
  contentBlocks: any[];
  onEditClick: (block: any) => void;
}

export const ContentBlocksTable = ({ contentBlocks, onEditClick }: ContentBlocksTableProps) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contentBlocks?.map((block) => (
          <TableRow key={block.id}>
            <TableCell className="font-medium">
              {block.title}
              {block.subtitle && (
                <p className="text-sm text-muted-foreground">
                  {block.subtitle}
                </p>
              )}
            </TableCell>
            <TableCell>
              <Badge 
                variant={block.is_active ? 'default' : 'secondary'}
                className={block.is_active ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {block.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>{block.order_index}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 hover:bg-purple-100"
                  onClick={() => navigate(`/content-blocks/${block.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 hover:bg-purple-100"
                  onClick={() => navigate(`/content-blocks/${block.id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeleteContentBlockDialog block={block} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};