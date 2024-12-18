import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientPortalLinkProps {
  isCollapsed: boolean;
}

export const ClientPortalLink = ({ isCollapsed }: ClientPortalLinkProps) => {
  return (
    <a
      href="/portal"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-all duration-200",
        "hover:bg-purple-light/10 hover:text-purple",
        isCollapsed && "justify-center"
      )}
    >
      <ExternalLink className="w-4 h-4" />
      {!isCollapsed && <span className="ml-3">Client Portal</span>}
    </a>
  );
};