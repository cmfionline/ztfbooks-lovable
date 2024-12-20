import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  showViewAll?: boolean;
}

export const SectionHeader = ({ title, description, showViewAll = true }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#141413]">{title}</h2>
        {description && (
          <p className="text-[#828179] mt-1">{description}</p>
        )}
      </div>
      {showViewAll && (
        <Button variant="ghost" className="text-[#141413]">
          View all <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};