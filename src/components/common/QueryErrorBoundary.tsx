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
        <div className="p-6 rounded-lg bg-destructive/10 text-destructive">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Error Occurred</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm">{error.message}</p>
            {error.stack && (
              <pre className="text-xs bg-destructive/5 p-4 rounded overflow-auto">
                {error.stack}
              </pre>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetErrorBoundary()}
              className="mt-4"
            >
              Try again
            </Button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};