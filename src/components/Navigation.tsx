import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          ZTF Books Admin
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/analytics" className="text-secondary hover:text-primary transition-colors">
            Analytics
          </Link>
          <Link to="/books" className="text-secondary hover:text-primary transition-colors">
            Books
          </Link>
          <Link to="/users" className="text-secondary hover:text-primary transition-colors">
            Users
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden md:inline-flex">
            Settings
          </Button>
          <Button className="text-white">
            New Book
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;