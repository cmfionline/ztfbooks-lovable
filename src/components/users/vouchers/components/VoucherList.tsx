import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Voucher } from "../types";

export interface VoucherListProps {
  vouchers: Voucher[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedVouchers: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const VoucherList = ({
  vouchers,
  currentPage,
  totalPages,
  onPageChange,
  selectedVouchers,
  onSelectionChange,
}: VoucherListProps) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(vouchers.map(v => v.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectVoucher = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedVouchers, id]);
    } else {
      onSelectionChange(selectedVouchers.filter(v => v !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">
                <Checkbox 
                  checked={selectedVouchers.length === vouchers.length}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-2 text-left">Code</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id} className="border-b">
                <td className="p-2">
                  <Checkbox 
                    checked={selectedVouchers.includes(voucher.id)}
                    onCheckedChange={(checked) => 
                      handleSelectVoucher(voucher.id, checked as boolean)
                    }
                  />
                </td>
                <td className="p-2 font-mono">{voucher.code}</td>
                <td className="p-2">{voucher.type}</td>
                <td className="p-2">{voucher.status}</td>
                <td className="p-2">
                  {new Date(voucher.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};