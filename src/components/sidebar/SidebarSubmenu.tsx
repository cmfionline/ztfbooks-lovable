import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarMenuItem } from "./SidebarMenuItem";

interface SidebarSubmenuProps {
  title: string;
  icon: React.ReactNode;
  items: Array<{ title: string; path: string; icon?: React.ReactNode }>;
  isActive: boolean;
  isCollapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onItemClick: () => void;
}

export const SidebarSubmenu = ({
  title,
  icon,
  items,
  isActive,
  isCollapsed,
  isOpen,
  onToggle,
  onItemClick,
}: SidebarSubmenuProps) => {
  return (
    <Collapsible open={isOpen && !isCollapsed} onOpenChange={onToggle}>
      <CollapsibleTrigger
        className={cn(
          "flex items-center w-full px-4 py-2 text-sm text-muted-foreground rounded-lg",
          "hover:bg-purple-light/10 hover:text-purple transition-colors",
          isActive && "bg-purple-light/10 text-purple font-medium",
          isCollapsed && "justify-center"
        )}
      >
        {icon}
        {!isCollapsed && (
          <>
            <span className="ml-3">{title}</span>
            <ChevronRight
              className={cn(
                "ml-auto h-4 w-4 transition-transform",
                isOpen && "transform rotate-90"
              )}
            />
          </>
        )}
      </CollapsibleTrigger>
      {!isCollapsed && (
        <CollapsibleContent className="space-y-1 pt-1">
          {items.map((item) => (
            <SidebarMenuItem
              key={item.path}
              title={item.title}
              path={item.path}
              icon={item.icon}
              isActive={false}
              isCollapsed={isCollapsed}
              onClick={onItemClick}
              isSubmenuItem
            />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};