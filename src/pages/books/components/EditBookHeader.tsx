import { Book } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

export const EditBookHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
        <Book className="w-6 h-6" />
        Edit Book
      </CardTitle>
    </CardHeader>
  );
};