import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Settings, Trash } from "lucide-react";
import { format } from "date-fns";
import { PriceManagement } from "./pricing/PriceManagement";
import { DiscountAnalytics } from "./analytics/DiscountAnalytics";

interface AdsListProps {
  ads: any[];
  viewMode: 'grid' | 'list';
  onDeleteAd: (id: string) => void;
}

export const AdsList = ({ ads, viewMode, onDeleteAd }: AdsListProps) => {
  if (!ads?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No advertisements found
      </div>
    );
  }

  return viewMode === 'grid' ? (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {ads.map((ad) => (
        <Card key={ad.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{ad.name}</span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDeleteAd(ad.id)}
                  className="hover:bg-red-50 text-red-600 focus:ring-2 focus:ring-red-500/50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Type: {ad.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  Placement: {ad.placement}
                </p>
                {ad.discount_type && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Discount: {ad.discount_type === 'percentage' ? `${ad.discount_value}%` : `$${ad.discount_value}`}
                    </p>
                    {ad.min_purchase_amount && (
                      <p className="text-sm text-muted-foreground">
                        Min Purchase: ${ad.min_purchase_amount}
                      </p>
                    )}
                    {ad.min_books_count && (
                      <p className="text-sm text-muted-foreground">
                        Min Books: {ad.min_books_count}
                      </p>
                    )}
                  </>
                )}
                <p className="text-sm text-muted-foreground">
                  Duration: {format(new Date(ad.start_date), 'PP')} - {format(new Date(ad.end_date), 'PP')}
                </p>
              </div>
              <PriceManagement adId={ad.id} />
              {ad.discount_type && (
                <DiscountAnalytics adId={ad.id} />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="space-y-4">
      {ads.map((ad) => (
        <Card key={ad.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-semibold">{ad.name}</h3>
              <p className="text-sm text-muted-foreground">
                {ad.type} • {ad.placement} • {ad.is_active ? "Active" : "Inactive"}
              </p>
              <PriceManagement adId={ad.id} />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDeleteAd(ad.id)}
                className="hover:bg-red-50 text-red-600 focus:ring-2 focus:ring-red-500/50"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};