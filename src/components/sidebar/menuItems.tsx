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
  ShoppingCart,
  BookText,
  Users,
  BookMarked,
  Tags,
  Building2,
  LayoutTemplate,
} from "lucide-react";

export const menuItems = [
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
      { title: "eBooks", icon: <BookText className="w-4 h-4" />, path: "/books/ebooks" },
      { title: "Authors", icon: <Users className="w-4 h-4" />, path: "/books/authors" },
      { title: "Series", icon: <BookMarked className="w-4 h-4" />, path: "/books/series" },
      { title: "Publishers", icon: <Building2 className="w-4 h-4" />, path: "/books/publishers" },
      { title: "Tags", icon: <Tags className="w-4 h-4" />, path: "/books/tags" },
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
    title: "Content Management",
    icon: <LayoutTemplate className="w-4 h-4" />,
    submenu: [
      { title: "Pages", path: "/pages" },
      { title: "Hero Sections", path: "/hero" },
    ],
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