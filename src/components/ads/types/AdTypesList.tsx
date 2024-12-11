import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CreateAdTypeDialog } from "./CreateAdTypeDialog";
import { EditAdTypeDialog } from "./EditAdTypeDialog";

export type AdType = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  status: 'active' | 'inactive';
};

export const AdTypesList = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingType, setEditingType] = useState<AdType | null>(null);

  const { data: adTypes, isLoading, refetch } = useQuery({
    queryKey: ['adTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching ad types",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as AdType[];
    },
  });

  const handleDelete = async (id: string) => {
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
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ad Types</h2>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-purple hover:bg-purple/90"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Ad Type
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adTypes?.map((adType) => (
            <Card key={adType.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <span className="text-lg">{adType.name}</span>
                    <Badge 
                      variant={adType.status === 'active' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {adType.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingType(adType)}
                      className="hover:bg-purple-light/30"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(adType.id)}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Type: {adType.type}</p>
                {adType.description && (
                  <p className="text-sm text-muted-foreground mt-2">{adType.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateAdTypeDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onSuccess={refetch}
      />

      <EditAdTypeDialog
        open={!!editingType}
        onOpenChange={() => setEditingType(null)}
        adType={editingType}
        onSuccess={refetch}
      />
    </div>
  );
};