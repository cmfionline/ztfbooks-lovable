import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { useToast } from "@/hooks/use-toast";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm">{error.message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={resetErrorBoundary}
          className="mt-4"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export const VoucherErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
