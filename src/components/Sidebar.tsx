import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CreditCard,
  HelpCircle,
  LineChart,
  Settings,
  Users,
  FileText,
  MessageSquare,
  PlusCircle,
  Bell,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      title: "Statistics",
      icon: <LineChart className="w-4 h-4" />,
      path: "/statistics",
    },
    {
      title: "Pages",
      icon: <FileText className="w-4 h-4" />,
      path: "/pages",
    },
    {
      title: "Ads",
      icon: <PlusCircle className="w-4 h-4" />,
      path: "/ads",
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
    <div 
      className={cn(
        "h-screen bg-background border-r border-border fixed left-0 top-0 overflow-y-auto transition-all duration-300 z-50",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && <h2 className="text-xl font-bold text-purple">ZTF Books Admin</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {menuItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={item.path} className="border-none">
              {item.submenu ? (
                <>
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className={cn(
                      "flex items-center text-sm text-muted-foreground hover:text-foreground",
                      isCollapsed && "justify-center"
                    )}>
                      {item.icon}
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </div>
                  </AccordionTrigger>
                  {!isCollapsed && (
                    <AccordionContent>
                      <div className="ml-6">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                          >
                            <ChevronRight className="w-3 h-3 mr-2" />
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors",
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
      </div>
    </div>
  );
};

export default Sidebar;