import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingSwitchProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const NotificationSettingSwitch = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: NotificationSettingSwitchProps) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="flex-1">
        {label}
        <p className="text-sm text-muted-foreground">{description}</p>
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};