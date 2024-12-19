import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CreateAdTypeDialog } from "./CreateAdTypeDialog";
import { EditAdTypeDialog } from "./EditAdTypeDialog";

export const AdTypesList = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);

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

      return data;
    },
  });

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
      refetch();
    } catch (error) {
      console.error('Error deleting ad type:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loading w-8 h-8 border-b-2 border-purple rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-purple hover:bg-purple/90 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Ad Type
        </Button>
      </div>

      <div className="space-y-4">
        {adTypes?.map((type) => (
          <Card key={type.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <h3 className="font-semibold">{type.name}</h3>
                <p className="text-sm text-muted-foreground">Type: {type.type}</p>
                {type.description && (
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Status: <span className={type.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                    {type.status}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setEditingType(type)}
                  className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(type.id)}
                  className="hover:bg-red-50 text-red-600 focus:ring-2 focus:ring-red-500/50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateAdTypeDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          refetch();
        }}
      />

      {editingType && (
        <EditAdTypeDialog
          open={!!editingType}
          onOpenChange={(open) => !open && setEditingType(null)}
          adType={editingType}
          onSuccess={() => {
            setEditingType(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};