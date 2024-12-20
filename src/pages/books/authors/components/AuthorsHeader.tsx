import { User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthorsHeaderProps {
  title: string;
  onAddClick: () => void;
}

export const AuthorsHeader = ({ title, onAddClick }: AuthorsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="text-2xl font-bold flex items-center gap-2">
        <User className="w-6 h-6" />
        {title}
      </div>
      <Button
        onClick={onAddClick}
        className="bg-purple hover:bg-purple/90"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Add Author
      </Button>
    </div>
  );
};