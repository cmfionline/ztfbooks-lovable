import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border ml-64">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button className="text-white">
            New Book
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;