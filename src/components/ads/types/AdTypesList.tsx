import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Check, X } from "lucide-react";
import { useState } from "react";
import { EditAdTypeDialog } from "./EditAdTypeDialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ad_types')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting ad type",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Ad type deleted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['adTypes'] });
      onDeleteAdType(id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete ad type",
        variant: "destructive",
      });
    }
  };

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
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{adType.name}</h3>
                  <Badge 
                    variant={adType.status === 'active' ? "success" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {adType.status === 'active' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {adType.status}
                  </Badge>
                </div>
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
                  onClick={() => handleDelete(adType.id)}
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