import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, Bell } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { PriceManagement } from "./pricing/PriceManagement";
import { DiscountAnalytics } from "./analytics/DiscountAnalytics";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import EditAdDialog from "./EditAdDialog";

interface AdsListProps {
  ads: any[];
  onDeleteAd: (id: string) => void;
  onEdit?: (adId: string) => void;
}

export const AdsList = ({ ads, onDeleteAd, onEdit }: AdsListProps) => {
  const [editingAd, setEditingAd] = useState<any>(null);

  const isDiscountExpiringSoon = (endDate: string) => {
    if (!endDate) return false;
    const daysUntilExpiry = differenceInDays(new Date(endDate), new Date());
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
  };

  if (!ads?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No advertisements found
      </div>
    );
  }

  const handleEdit = (ad: any) => {
    if (onEdit) {
      onEdit(ad.id);
    } else {
      setEditingAd(ad);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {ads.map((ad) => (
          <Card key={ad.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{ad.name}</h3>
                  {ad.discount_type && isDiscountExpiringSoon(ad.discount_end_date) && (
                    <Badge variant="destructive" className="animate-pulse">
                      <Bell className="h-3 w-3 mr-1" />
                      Expires Soon
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {ad.type} • {ad.placement} • {ad.is_active ? "Active" : "Inactive"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Duration: {format(new Date(ad.start_date), 'PP')} - {format(new Date(ad.end_date), 'PP')}
                </p>
                {ad.discount_type && (
                  <p className="text-sm text-muted-foreground">
                    Discount: {ad.discount_type === 'percentage' ? `${ad.discount_value}%` : `$${ad.discount_value}`}
                  </p>
                )}
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
                  onClick={() => handleEdit(ad)}
                  className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
                >
                  <Pencil className="h-4 w-4" />
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

      <EditAdDialog 
        open={!!editingAd} 
        onOpenChange={(open) => !open && setEditingAd(null)}
        ad={editingAd}
      />
    </>
  );
};