import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarSubmenu } from "./sidebar/SidebarSubmenu";
import { ClientPortalLink } from "./sidebar/ClientPortalLink";
import { menuItems } from "./sidebar/menuItems";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();

  const handleSubmenuToggle = (submenuName: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenSubmenu(submenuName);
    } else {
      setOpenSubmenu(openSubmenu === submenuName ? null : submenuName);
    }
  };

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col",
        "bg-background border-r border-border",
        "transition-all duration-300 ease-in-out",
        "md:translate-x-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border">
        {!isCollapsed && (
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple to-purple-light bg-clip-text text-transparent">
            ZTF Books Admin
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            setOpenSubmenu(null);
          }}
          className="ml-auto hover:bg-purple-light/10"
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4 text-purple" />
          ) : (
            <X className="w-4 h-4 text-purple" />
          )}
        </Button>
      </div>
      
      <nav className="flex-1 overflow-y-auto scrollbar-none p-2 space-y-1">
        <ClientPortalLink isCollapsed={isCollapsed} />

        {menuItems.map((item) => (
          item.submenu ? (
            <SidebarSubmenu
              key={item.title}
              title={item.title}
              icon={item.icon}
              items={item.submenu}
              isActive={location.pathname.startsWith(item.submenu[0].path)}
              isCollapsed={isCollapsed}
              isOpen={openSubmenu === item.title}
              onToggle={() => handleSubmenuToggle(item.title)}
              onItemClick={handleItemClick}
            />
          ) : (
            <SidebarMenuItem
              key={item.title}
              title={item.title}
              path={item.path}
              icon={item.icon}
              isActive={location.pathname === item.path}
              isCollapsed={isCollapsed}
              onClick={handleItemClick}
            />
          )
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;