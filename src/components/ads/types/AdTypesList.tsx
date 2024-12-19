import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { EditAdTypeDialog } from "./EditAdTypeDialog";

export interface AdType {
  id: string;
  name: string;
  type: string;
  description?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

interface AdTypesListProps {
  adTypes: AdType[];
  onDeleteAdType: (id: string) => void;
}

export const AdTypesList = ({ adTypes, onDeleteAdType }: AdTypesListProps) => {
  const [editingAdType, setEditingAdType] = useState<AdType | null>(null);

  if (!adTypes?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No ad types found
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {adTypes.map((adType) => (
          <Card key={adType.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <h3 className="font-semibold">{adType.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {adType.type}
                </p>
                {adType.description && (
                  <p className="text-sm text-muted-foreground">
                    {adType.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setEditingAdType(adType)}
                  className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDeleteAdType(adType.id)}
                  className="hover:bg-red-50 text-red-600 focus:ring-2 focus:ring-red-500/50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditAdTypeDialog 
        open={!!editingAdType}
        onOpenChange={(open) => !open && setEditingAdType(null)}
        adType={editingAdType}
        onSuccess={() => setEditingAdType(null)}
      />
    </>
  );
};