import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  componentStack?: string;
  eventId?: string;
}

const ErrorFallback = ({ 
  error, 
  resetErrorBoundary,
  componentStack,
  eventId 
}: ErrorFallbackProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Log error for monitoring
    console.error("Error caught by boundary:", {
      error,
      componentStack,
      eventId
    });

    toast({
      variant: "destructive",
      title: "An error occurred",
      description: "We're looking into this issue. Please try again.",
    });
  }, [error, componentStack, eventId, toast]);

  const isNetworkError = error instanceof TypeError && error.message.includes('network');
  const isAuthError = error.message.toLowerCase().includes('unauthorized') || 
                     error.message.toLowerCase().includes('unauthenticated');
  const isRateLimitError = error.message.toLowerCase().includes('rate limit');

  const getErrorMessage = () => {
    if (isNetworkError) return "Network connection issue. Please check your connection.";
    if (isAuthError) return "Authentication error. Please sign in again.";
    if (isRateLimitError) return "Too many requests. Please try again later.";
    return error.message || "An unexpected error occurred.";
  };

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {isAuthError ? "Access Denied" : "Something went wrong"}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm mb-2">{getErrorMessage()}</p>
        {process.env.NODE_ENV === 'development' && componentStack && (
          <pre className="text-xs bg-destructive/5 p-4 rounded overflow-auto max-h-[200px] mb-4">
            {componentStack}
          </pre>
        )}
        {eventId && (
          <p className="text-xs text-muted-foreground mb-2">
            Reference ID: {eventId}
          </p>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={resetErrorBoundary}
          className="mt-2"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

interface EnhancedErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, componentStack: string) => void;
  fallbackComponent?: React.ComponentType<ErrorFallbackProps>;
}

export const EnhancedErrorBoundary = ({ 
  children,
  onError,
  fallbackComponent: FallbackComponent = ErrorFallback
}: EnhancedErrorBoundaryProps) => {
  const handleError = (error: Error, componentStack: string) => {
    const eventId = Math.random().toString(36).substring(7);
    console.error("Error caught by boundary:", { error, componentStack, eventId });
    onError?.(error, componentStack);
  };

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={() => {
        // Optional: Clear error-related state or refresh data
        console.log("Error boundary reset");
      }}
    >
      {children}
    </ErrorBoundary>
  );
};