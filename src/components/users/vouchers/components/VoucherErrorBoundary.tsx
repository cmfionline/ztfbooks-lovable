import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { trackVoucherError } from "../monitoring/VoucherMetrics";

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
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        trackVoucherError(error, { component: "VoucherErrorBoundary" });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};