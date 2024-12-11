import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, XCircle } from "lucide-react";

interface EnablePayStackCardProps {
  isActive: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export const EnablePayStackCard = ({ isActive, isLoading, onToggle }: EnablePayStackCardProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Enable PayStack Payments</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Accept payments through PayStack
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
          <span className="text-sm text-gray-600">
            {isActive ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};