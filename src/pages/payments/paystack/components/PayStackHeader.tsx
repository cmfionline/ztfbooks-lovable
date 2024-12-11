import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PayStackHeader = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">PayStack Settings</CardTitle>
        <CardDescription>
          Configure your PayStack integration for secure payments
        </CardDescription>
      </CardHeader>
    </Card>
  );
};