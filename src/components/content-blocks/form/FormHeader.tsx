import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const FormHeader = ({ isEditing }: { isEditing: boolean }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/content-blocks")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <h1 className="text-2xl font-bold">
        {isEditing ? "Edit" : "Create"} Content Block
      </h1>
    </div>
  );
};