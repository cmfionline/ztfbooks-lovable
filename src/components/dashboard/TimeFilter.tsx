import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type TimeFilterValue = "this_week" | "last_week" | "this_month" | "last_month" | "mtd" | "ytd" | "this_year" | "last_year";

interface TimeFilterProps {
  value: TimeFilterValue;
  onValueChange: (value: TimeFilterValue) => void;
}

export const TimeFilter = ({ value, onValueChange }: TimeFilterProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] bg-white border-purple-light/50 focus:ring-purple">
        <SelectValue placeholder="Select time period" className="text-gray-600" />
      </SelectTrigger>
      <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-light/50 shadow-lg z-50">
        <SelectItem value="this_week" className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700">This Week</SelectItem>
        <SelectItem value="last_week" className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700">Last Week</SelectItem>
        <SelectItem value="this_month" className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700">This Month</SelectItem>
        <SelectItem value="last_month" className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700">Last Month</SelectItem>
        <SelectItem value="mtd" className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700">Month to Date</SelectItem>
        <SelectItem value="ytd" className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700">Year to Date</SelectItem>
        <SelectItem value="this_year" className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700">This Year</SelectItem>
        <SelectItem value="last_year" className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700">Last Year</SelectItem>
      </SelectContent>
    </Select>
  );
};