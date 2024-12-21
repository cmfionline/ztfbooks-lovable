import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, Check, X, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Voucher } from "../types";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { toast } from "sonner";

interface VoucherListProps {
  vouchers: Voucher[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDownload: (voucherId: string) => void;
  onPrint: (voucherId: string) => void;
  onBulkAction?: (action: 'delete' | 'download' | 'print', voucherIds: string[]) => void;
}

export const VoucherList = ({
  vouchers,
  currentPage,
  totalPages,
  onPageChange,
  onDownload,
  onPrint,
  onBulkAction
}: VoucherListProps) => {
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVouchers(vouchers.map(v => v.id));
    } else {
      setSelectedVouchers([]);
    }
  };

  const handleSelectVoucher = (voucherId: string, checked: boolean) => {
    if (checked) {
      setSelectedVouchers([...selectedVouchers, voucherId]);
    } else {
      setSelectedVouchers(selectedVouchers.filter(id => id !== voucherId));
    }
  };

  return (
    <div className="space-y-4">
      {selectedVouchers.length > 0 && (
        <div className="flex gap-2 p-2 bg-gray-50 rounded">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction?.('download', selectedVouchers)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction?.('print', selectedVouchers)}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkAction?.('delete', selectedVouchers)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedVouchers.length === vouchers.length}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              />
            </TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers?.map((voucher) => (
            <TableRow key={voucher.id}>
              <TableCell>
                <Checkbox
                  checked={selectedVouchers.includes(voucher.id)}
                  onCheckedChange={(checked) => handleSelectVoucher(voucher.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="font-mono">{voucher.code}</TableCell>
              <TableCell className="capitalize">{voucher.type.replace(/_/g, ' ')}</TableCell>
              <TableCell>
                <Badge variant={voucher.redeemed ? "secondary" : "default"}>
                  {voucher.redeemed ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <X className="w-3 h-3 mr-1" />
                  )}
                  {voucher.redeemed ? 'Redeemed' : 'Active'}
                </Badge>
              </TableCell>
              <TableCell>${voucher.total_amount}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(voucher.id)}
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPrint(voucher.id)}
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </Button>
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

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => onPageChange(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};