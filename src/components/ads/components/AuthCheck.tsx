import { Card, CardContent } from "@/components/ui/card";

export const AuthCheck = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-center text-gray-600">
          Please log in to create or edit ads.
        </p>
      </CardContent>
    </Card>
  );
};