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
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LineChart className="w-4 h-4" />,
    path: "/",
  },
  {
    title: "Books",
    icon: <BookOpen className="w-4 h-4" />,
    path: "/books",
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
    title: "Ads & Discounts",
    icon: <Percent className="w-4 h-4" />,
    path: "/ads",
    submenu: [
      { title: "All Ads", path: "/ads" },
      { title: "Discount Strategies", path: "/ads/discount-strategies" },
      { title: "Analytics", path: "/ads/analytics" },
    ],
  },
  {
    title: "Payment Gateways",
    icon: <CreditCard className="w-4 h-4" />,
    path: "/payments",
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

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const location = useLocation();

  const handleItemClick = (itemValue: string) => {
    setOpenItem(openItem === itemValue ? undefined : itemValue);
  };

  const handleLinkClick = () => {
    setOpenItem(undefined);
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
      <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <nav className="flex-1 overflow-y-auto scrollbar-none">
        <Accordion
          type="single"
          collapsible
          className="space-y-1 p-2"
          value={openItem}
          onValueChange={setOpenItem}
        >
          {menuItems.map((item, index) => (
            <AccordionItem
              value={`item-${index}`}
              key={item.path}
              className="border-none"
            >
              {item.submenu ? (
                <>
                  <AccordionTrigger
                    className={cn(
                      "flex items-center py-2 px-4 text-sm text-muted-foreground",
                      "hover:bg-purple-light/10 hover:text-purple rounded-lg",
                      "hover:no-underline transition-colors",
                      location.pathname.startsWith(item.path) &&
                        "bg-purple-light/10 text-purple font-medium"
                    )}
                    onClick={() => handleItemClick(`item-${index}`)}
                  >
                    <div
                      className={cn(
                        "flex items-center",
                        isCollapsed && "justify-center"
                      )}
                    >
                      {item.icon}
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </div>
                  </AccordionTrigger>
                  {!isCollapsed && (
                    <AccordionContent className="pt-1 pb-2">
                      {item.submenu.map((subItem) => (
                        <SidebarMenuItem
                          key={subItem.path}
                          title={subItem.title}
                          path={subItem.path}
                          isActive={location.pathname === subItem.path}
                          isCollapsed={isCollapsed}
                          onClick={handleLinkClick}
                          isSubmenuItem
                        />
                      ))}
                    </AccordionContent>
                  )}
                </>
              ) : (
                <SidebarMenuItem
                  title={item.title}
                  path={item.path}
                  icon={item.icon}
                  isActive={location.pathname === item.path}
                  isCollapsed={isCollapsed}
                  onClick={handleLinkClick}
                />
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </aside>
  );
};

export default Sidebar;