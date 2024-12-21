import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Ban, Trash2 } from "lucide-react";
import type { Voucher } from "../types";

interface VoucherListProps {
  vouchers: Voucher[];
  onToggleStatus: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
}

export const VoucherList = ({ vouchers, onToggleStatus, onDelete }: VoucherListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Downloads</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vouchers?.map((voucher) => (
          <TableRow key={voucher.id}>
            <TableCell className="font-mono">{voucher.code}</TableCell>
            <TableCell className="capitalize">
              {voucher.type.replace(/_/g, ' ')}
            </TableCell>
            <TableCell>
              {voucher.type === 'single_book' && voucher.books?.[0]?.book?.title}
              {voucher.type === 'series' && voucher.series?.[0]?.series?.name}
              {voucher.type === 'book_tag' && voucher.tags?.[0]?.tag?.name}
              {voucher.type === 'all_books' && 'All Books'}
            </TableCell>
            <TableCell>{voucher.number_of_downloads}</TableCell>
            <TableCell>
              <Badge 
                variant={voucher.status === 'active' ? "default" : "secondary"}
                className="capitalize"
              >
                {voucher.status === 'active' ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <X className="w-3 h-3 mr-1" />
                )}
                {voucher.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(voucher)}
                  title={voucher.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  <Ban className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(voucher)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {vouchers?.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No vouchers found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};