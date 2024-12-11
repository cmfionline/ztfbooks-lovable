import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EnableMobileMoneyCardProps {
  isActive: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export const EnableMobileMoneyCard = ({
  isActive,
  isLoading,
  onToggle,
}: EnableMobileMoneyCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enable Mobile Money</CardTitle>
        <CardDescription>
          Toggle Mobile Money payments on or off for your store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="mobile-money-toggle" className="flex flex-col space-y-1">
            <span>Mobile Money payments</span>
            <span className="text-sm text-muted-foreground">
              {isActive ? 'Enabled' : 'Disabled'}
            </span>
          </Label>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Switch
              id="mobile-money-toggle"
              checked={isActive}
              onCheckedChange={onToggle}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};