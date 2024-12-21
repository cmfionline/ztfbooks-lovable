import { TimeFilter } from "./TimeFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const authors = ["All Authors", "Zacharias T. Fomum", "Other Contributors"];
const series = ["All Series", "Christian Living", "Prayer", "Leadership", "Discipleship"];
const tags = ["All Tags", "Prayer", "Fasting", "Holy Spirit", "Leadership", "Discipleship"];
const voucherTypes = ["All Types", "Single Book", "Multiple Books", "Series", "Book Tag", "All Books"];
const voucherStatus = ["All Status", "Active", "Redeemed", "Expired"];

export const Filters = ({ onSearch, onExport }: { 
  onSearch?: (value: string) => void;
  onExport?: (format: 'pdf' | 'excel') => void;
}) => {
  return (
    <div className="flex flex-col gap-4 mb-8 bg-gradient-to-r from-purple-light/50 to-white p-4 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search vouchers..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-white/95 border-purple-light/50"
            icon={<Search className="h-4 w-4 text-gray-500" />}
          />
        </div>
        
        <TimeFilter value="this_week" onValueChange={(value) => console.log(value)} />
        
        <Select>
          <SelectTrigger className="w-[180px] bg-white/95 border-purple-light/50 focus:ring-purple text-gray-700">
            <SelectValue placeholder="Voucher type" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-light/50 shadow-lg z-50">
            {voucherTypes.map((type) => (
              <SelectItem 
                key={type} 
                value={type.toLowerCase()}
                className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700"
              >
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px] bg-white/95 border-purple-light/50 focus:ring-purple text-gray-700">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-light/50 shadow-lg z-50">
            {voucherStatus.map((status) => (
              <SelectItem 
                key={status} 
                value={status.toLowerCase()}
                className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700"
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => onExport?.('pdf')}
          className="bg-white/95 hover:bg-purple-light/10 border-purple-light/50 text-gray-700"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onExport?.('excel')}
          className="bg-white/95 hover:bg-purple-light/10 border-purple-light/50 text-gray-700"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
      </div>
    </div>
  );
};