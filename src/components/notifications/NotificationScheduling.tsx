import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface NotificationSchedulingProps {
  scheduleType: "immediate" | "scheduled" | "recurring";
  scheduledFor: string;
  recurringSchedule: any;
  onScheduleTypeChange: (value: "immediate" | "scheduled" | "recurring") => void;
  onScheduledForChange: (value: string) => void;
  onRecurringScheduleChange: (value: any) => void;
}

export const NotificationScheduling = ({
  scheduleType,
  scheduledFor,
  recurringSchedule,
  onScheduleTypeChange,
  onScheduledForChange,
  onRecurringScheduleChange,
}: NotificationSchedulingProps) => {
  const [selectedFrequency, setSelectedFrequency] = useState(recurringSchedule?.frequency || "daily");

  const handleFrequencyChange = (value: string) => {
    setSelectedFrequency(value);
    onRecurringScheduleChange({ ...recurringSchedule, frequency: value });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-border">
      <RadioGroup value={scheduleType} onValueChange={onScheduleTypeChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="immediate" id="immediate" />
          <Label htmlFor="immediate">Send Immediately</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="scheduled" id="scheduled" />
          <Label htmlFor="scheduled">Schedule for Later</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="recurring" id="recurring" />
          <Label htmlFor="recurring">Recurring Schedule</Label>
        </div>
      </RadioGroup>

      {scheduleType === "scheduled" && (
        <div className="space-y-2">
          <Label htmlFor="scheduledFor">Schedule Date & Time</Label>
          <Input
            type="datetime-local"
            id="scheduledFor"
            value={scheduledFor}
            onChange={(e) => onScheduledForChange(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          />
        </div>
      )}

      {scheduleType === "recurring" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={selectedFrequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recurringTime">Time</Label>
            <Input
              type="time"
              id="recurringTime"
              value={recurringSchedule?.time || ""}
              onChange={(e) => onRecurringScheduleChange({ ...recurringSchedule, time: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};