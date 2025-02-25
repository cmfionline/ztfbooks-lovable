import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Notification Error</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm">{error.message}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={resetErrorBoundary}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export const NotificationErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        console.error("Notification Error:", error);
        // You could send this to an error tracking service
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};