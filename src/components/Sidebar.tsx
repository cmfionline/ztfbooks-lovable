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
  Ticket,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Sidebar = () => {
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
        { title: "Vouchers", path: "/payments/vouchers" },
      ],
    },
    {
      title: "Vouchers",
      icon: <Ticket className="w-4 h-4" />,
      path: "/vouchers",
      submenu: [
        { title: "All Vouchers", path: "/vouchers" },
        { title: "Create Voucher", path: "/vouchers/create" },
        { title: "Analytics", path: "/vouchers/analytics" },
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
      submenu: [
        { title: "About Us", path: "/pages/about" },
        { title: "Privacy Policy", path: "/pages/privacy" },
        { title: "Terms of Service", path: "/pages/terms" },
      ],
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
    <div className="w-64 h-screen bg-white border-r border-border fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-purple mb-6">ZTF Books Admin</h2>
        <Accordion type="single" collapsible className="w-full">
          {menuItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={item.path} className="border-none">
              {item.submenu ? (
                <>
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center text-sm text-gray-600">
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="ml-6">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className="flex items-center px-4 py-2 text-sm text-gray-500 hover:bg-purple-light/30 rounded-lg transition-colors"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-purple-light/50 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
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
