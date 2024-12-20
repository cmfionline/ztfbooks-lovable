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

interface ContentBlocksTableProps {
  contentBlocks: any[];
  onEditClick: (block: any) => void;
}

export const ContentBlocksTable = ({ contentBlocks, onEditClick }: ContentBlocksTableProps) => {
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
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-purple-100"
                onClick={() => window.open(`/content-blocks/${block.id}`, '_blank')}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-purple-100"
                onClick={() => onEditClick(block)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <DeleteContentBlockDialog block={block} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};