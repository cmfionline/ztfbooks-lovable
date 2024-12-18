import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EditBookErrorProps {
  error: Error;
}

export const EditBookError = ({ error }: EditBookErrorProps) => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};