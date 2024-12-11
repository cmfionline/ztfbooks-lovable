import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const SidebarHeader = ({ isCollapsed, setIsCollapsed }: SidebarHeaderProps) => {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border">
      {!isCollapsed && (
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple to-purple-light bg-clip-text text-transparent">
          ZTF Books Admin
        </h2>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="ml-auto hover:bg-purple-light/10"
      >
        {isCollapsed ? (
          <Menu className="w-4 h-4 text-purple" />
        ) : (
          <X className="w-4 h-4 text-purple" />
        )}
      </Button>
    </div>
  );
};