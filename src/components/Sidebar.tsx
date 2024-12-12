import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BookOpen,
  CreditCard,
  HelpCircle,
  LineChart,
  Settings,
  FileText,
  MessageSquare,
  Bell,
  Percent,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarSubmenu } from "./sidebar/SidebarSubmenu";

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
    // Only collapse on mobile view
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LineChart className="w-4 h-4" />,
      path: "/",
    },
    {
      title: "Orders",
      icon: <ShoppingCart className="w-4 h-4" />,
      submenu: [
        { title: "All Orders", path: "/orders" },
        { title: "Device Management", path: "/orders/devices" },
        { title: "Analytics", path: "/orders/analytics" },
      ],
    },
    {
      title: "Books",
      icon: <BookOpen className="w-4 h-4" />,
      submenu: [
        { title: "eBooks", path: "/books/ebooks" },
        { title: "Authors", path: "/books/authors" },
        { title: "Series", path: "/books/series" },
        { title: "Publishers", path: "/books/publishers" },
        { title: "Tags", path: "/books/tags" },
        { title: "Languages", path: "/books/languages" },
      ],
    },
    {
      title: "Support",
      icon: <MessageSquare className="w-4 h-4" />,
      path: "/support",
    },
    {
      title: "Ads & Discounts",
      icon: <Percent className="w-4 h-4" />,
      submenu: [
        { title: "All Ads", path: "/ads" },
        { title: "Discount Strategies", path: "/ads/discount-strategies" },
        { title: "Analytics", path: "/ads/analytics" },
      ],
    },
    {
      title: "Payment Gateways",
      icon: <CreditCard className="w-4 h-4" />,
      submenu: [
        { title: "Stripe", path: "/payments/stripe" },
        { title: "Paystack", path: "/payments/paystack" },
        { title: "Flutterwave", path: "/payments/flutterwave" },
        { title: "Mobile Money", path: "/payments/mobile-money" },
      ],
    },
    {
      title: "Pages",
      icon: <FileText className="w-4 h-4" />,
      path: "/pages",
    },
    {
      title: "Book Reviews",
      icon: <MessageSquare className="w-4 h-4" />,
      path: "/reviews",
    },
    {
      title: "FAQs",
      icon: <HelpCircle className="w-4 h-4" />,
      path: "/faqs",
    },
    {
      title: "Notifications",
      icon: <Bell className="w-4 h-4" />,
      path: "/notifications",
    },
    {
      title: "Settings",
      icon: <Settings className="w-4 h-4" />,
      path: "/settings",
    },
  ];

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
