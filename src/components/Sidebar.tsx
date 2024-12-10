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
} from "lucide-react";

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
        { title: "Add Book", path: "/books/add" },
        { title: "Authors", path: "/books/authors" },
        { title: "Series", path: "/books/series" },
        { title: "Tags", path: "/books/tags" },
        { title: "Publishers", path: "/books/publishers" },
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
      title: "Users",
      icon: <Users className="w-4 h-4" />,
      path: "/users",
      submenu: [
        { title: "Admins", path: "/users/admins" },
        { title: "Groups", path: "/users/groups" },
        { title: "Permissions", path: "/users/permissions" },
        { title: "Clients", path: "/users/clients" },
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
      title: "Settings",
      icon: <Settings className="w-4 h-4" />,
      path: "/settings",
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-border fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-purple mb-6">ZTF Books Admin</h2>
        <nav>
          {menuItems.map((item) => (
            <div key={item.path} className="mb-2">
              <Link
                to={item.path}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-purple-light/50 rounded-lg transition-colors"
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
              {item.submenu && (
                <div className="ml-6 mt-1">
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
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;