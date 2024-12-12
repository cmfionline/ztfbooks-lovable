import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  title: string;
  path: string;
  icon?: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  isSubmenuItem?: boolean;
}

export const SidebarMenuItem = ({
  title,
  path,
  icon,
  isActive,
  isCollapsed,
  onClick,
  isSubmenuItem = false,
}: SidebarMenuItemProps) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-all duration-200",
        "hover:bg-purple-light/10 hover:text-purple",
        isActive && "bg-purple-light/10 text-purple font-medium",
        isCollapsed && "justify-center",
        isSubmenuItem && "ml-6"
      )}
    >
      {isSubmenuItem && !icon && <ChevronRight className="w-3 h-3 mr-2 text-current" />}
      {icon}
      {!isCollapsed && <span className={cn("ml-3", isSubmenuItem && "text-sm")}>{title}</span>}
    </Link>
  );
};