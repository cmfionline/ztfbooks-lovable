import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NotificationTargetingProps {
  targetAudience: any;
  onTargetAudienceChange: (value: any) => void;
}

export const NotificationTargeting = ({
  targetAudience,
  onTargetAudienceChange,
}: NotificationTargetingProps) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-border">
      <div className="space-y-2">
        <Label>Target Audience</Label>
        <Select
          value={targetAudience?.type || "all"}
          onValueChange={(value) => onTargetAudienceChange({ ...targetAudience, type: value })}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select target audience" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="premium">Premium Users</SelectItem>
            <SelectItem value="free">Free Users</SelectItem>
            <SelectItem value="inactive">Inactive Users</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};