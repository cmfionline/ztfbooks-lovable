import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const BookLoadingState = () => {
  return (
    <div className="space-y-8">
      {/* Header Loading State */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Search Loading State */}
      <Skeleton className="h-10 w-full max-w-md" />

      {/* Table Loading State */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-8 gap-4 border-b pb-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-4 w-full" />
            ))}
          </div>

          {/* Table Rows */}
          {[...Array(5)].map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid grid-cols-8 gap-4 py-4 border-b last:border-0"
            >
              {/* Book Info Column */}
              <div className="col-span-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-8" /> {/* Book cover */}
                  <Skeleton className="h-4 w-24" /> {/* Title */}
                </div>
              </div>

              {/* Other Columns */}
              {[...Array(6)].map((_, colIndex) => (
                <Skeleton
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="h-4 w-full"
                />
              ))}

              {/* Actions Column */}
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
