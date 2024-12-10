import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, XCircle } from "lucide-react";

interface EnableFlutterwaveCardProps {
  isActive: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export const EnableFlutterwaveCard = ({ isActive, isLoading, onToggle }: EnableFlutterwaveCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Enable Flutterwave Payments</CardTitle>
            <CardDescription>
              Accept payments through Flutterwave
            </CardDescription>
          </div>
          {isActive ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Switch
            checked={isActive}
            onCheckedChange={onToggle}
            disabled={isLoading}
          />
          <span className="text-sm text-muted-foreground">
            {isActive ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};