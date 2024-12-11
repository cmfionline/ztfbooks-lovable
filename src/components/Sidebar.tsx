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
  ChevronRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const location = useLocation();

  const handleItemClick = (itemValue: string) => {
    if (!isCollapsed) {
      setOpenItem(openItem === itemValue ? undefined : itemValue);
    }
  };

  const handleLinkClick = () => {
    setOpenItem(undefined);
  };

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
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={handleLinkClick}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-all duration-200",
                            "hover:bg-purple-light/10 hover:text-purple",
                            location.pathname === subItem.path && "bg-purple-light/10 text-purple font-medium",
                            isCollapsed && "justify-center",
                            "ml-6"
                          )}
                        >
                          <ChevronRight className="w-3 h-3 mr-2 text-current" />
                          {subItem.title}
                        </Link>
                      ))}
                    </AccordionContent>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-all duration-200",
                    "hover:bg-purple-light/10 hover:text-purple",
                    location.pathname === item.path && "bg-purple-light/10 text-purple font-medium",
                    isCollapsed && "justify-center"
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </aside>
  );
};

export default Sidebar;