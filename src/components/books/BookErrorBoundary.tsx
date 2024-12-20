import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { useToast } from "@/hooks/use-toast";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const { toast } = useToast();
  
  // Log error for debugging
  console.error("Book error:", error);

  // Show toast for user feedback
  React.useEffect(() => {
    toast({
      variant: "destructive",
      title: "Error",
      description: "There was a problem loading the book content. Please try again.",
    });
  }, [error, toast]);

  // Determine if error is a known type
  const isNetworkError = error instanceof TypeError && error.message.includes('network');
  const isValidationError = error.message.includes('validation');
  const isAuthError = error.message.includes('unauthorized') || error.message.includes('unauthenticated');

  // Customize error message based on type
  const getErrorMessage = () => {
    if (isNetworkError) return "Network error. Please check your connection.";
    if (isValidationError) return "Invalid data received. Please try again.";
    if (isAuthError) return "You don't have permission to view this content.";
    return error.message || "An unexpected error occurred.";
  };

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {isAuthError ? "Access Denied" : "Something went wrong!"}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm mb-2">{getErrorMessage()}</p>
        {error.stack && process.env.NODE_ENV === 'development' && (
          <pre className="text-xs bg-destructive/5 p-4 rounded overflow-auto max-h-[200px] mb-4">
            {error.stack}
          </pre>
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

export const BookErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const handleError = (error: Error) => {
    // Log error to your error tracking service
    console.error("Book error boundary caught error:", error);
  };

  return (
    <ReactErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Optional: Clear any error-related state here
        console.log("Error boundary reset");
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};