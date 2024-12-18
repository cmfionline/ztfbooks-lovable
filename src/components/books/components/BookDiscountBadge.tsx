import { BadgePercent } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface BookDiscountBadgeProps {
  originalPrice: number;
  discountPercentage: number;
  className?: string;
}

export const BookDiscountBadge = ({
  originalPrice,
  discountPercentage,
  className,
}: BookDiscountBadgeProps) => {
  const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;

  return (
    <div
      className={cn(
        "absolute top-2 right-2 bg-red-500 text-white rounded-lg shadow-lg p-2 space-y-1",
        className
      )}
    >
      <div className="flex items-center gap-1 text-sm font-bold">
        <BadgePercent className="w-4 h-4" />
        <span>-{discountPercentage}%</span>
      </div>
      <div className="text-xs space-y-0.5">
        <div className="line-through opacity-75">
          {formatPrice(originalPrice)}
        </div>
        <div className="font-bold">
          {formatPrice(discountedPrice)}
        </div>
      </div>
    </div>
  );
};