import { Link, Outlet } from "react-router-dom";
import { Book, Home, User, MessageSquare, Bell, HelpCircle } from "lucide-react";

const PortalLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link to="/portal" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">ZTF Books</span>
          </Link>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
            <Link to="/portal" className="transition-colors hover:text-foreground/80">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
            <Link to="/portal/library" className="transition-colors hover:text-foreground/80">
              <Book className="h-4 w-4" />
              <span className="sr-only">Library</span>
            </Link>
            <Link to="/portal/support" className="transition-colors hover:text-foreground/80">
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Support</span>
            </Link>
            <Link to="/portal/faqs" className="transition-colors hover:text-foreground/80">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">FAQs</span>
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/portal/notifications" className="transition-colors hover:text-foreground/80">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Link>
            <Link to="/portal/profile" className="transition-colors hover:text-foreground/80">
              <User className="h-4 w-4" />
              <span className="sr-only">Profile</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-screen-2xl py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="container max-w-screen-2xl py-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-semibold">About</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/portal/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/portal/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/portal/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/portal/support" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/portal/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/portal/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Social</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;