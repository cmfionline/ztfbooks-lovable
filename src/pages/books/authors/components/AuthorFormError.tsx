import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AuthorFormErrorProps {
  error: Error;
}

export const AuthorFormError = ({ error }: AuthorFormErrorProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || "An error occurred while loading the form."}
      </AlertDescription>
    </Alert>
  );
};