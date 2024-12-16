import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const EbooksHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Books Management</h1>
      <Link to="/books/add">
        <Button className="bg-purple hover:bg-purple/90">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </Link>
    </div>
  );
};