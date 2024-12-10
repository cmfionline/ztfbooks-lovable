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
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="this_week">This Week</SelectItem>
        <SelectItem value="last_week">Last Week</SelectItem>
        <SelectItem value="this_month">This Month</SelectItem>
        <SelectItem value="last_month">Last Month</SelectItem>
        <SelectItem value="mtd">Month to Date</SelectItem>
        <SelectItem value="ytd">Year to Date</SelectItem>
        <SelectItem value="this_year">This Year</SelectItem>
        <SelectItem value="last_year">Last Year</SelectItem>
      </SelectContent>
    </Select>
  );
};