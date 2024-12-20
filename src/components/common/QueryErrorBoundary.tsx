import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
}

export const QueryErrorBoundary = ({ children }: QueryErrorBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error</h3>
          </div>
          <p className="text-sm mb-4">{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetErrorBoundary()}
          >
            Try again
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};