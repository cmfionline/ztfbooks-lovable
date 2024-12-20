import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  isEditing: boolean;
}

export const FormSubmitButton = ({ isSubmitting, isEditing }: FormSubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
      disabled={isSubmitting}
      aria-busy={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Updating..." : "Creating..."}
        </>
      ) : (
        <>{isEditing ? "Update" : "Create"} Content Block</>
      )}
    </Button>
  );
};