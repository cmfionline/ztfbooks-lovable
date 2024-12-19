import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdForm } from "@/components/ads/form/AdForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { AdsList } from "@/components/ads/AdsList";
import { AdTypesTabContent } from "@/components/ads/tabs/AdTypesTabContent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Ads = () => {
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: ads, isLoading, refetch } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Ad deleted successfully",
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting ad:', error);
      toast({
        title: "Error",
        description: "Failed to delete ad",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (adId: string) => {
    setShowCreateForm(false); // Hide create form if it's open
    setEditingAdId(adId);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Advertisements</h1>
        </div>

        <Tabs defaultValue="ads" className="space-y-4">
          <TabsList className="tabs-list">
            <TabsTrigger value="ads" className="tab">Ads</TabsTrigger>
            <TabsTrigger value="types" className="tab">Ad Types</TabsTrigger>
          </TabsList>

          <TabsContent value="ads" className="space-y-6">
            {!showCreateForm && !editingAdId && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-purple hover:bg-purple/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Ad
                </Button>
              </div>
            )}

            {showCreateForm && (
              <Card className="p-6">
                <AdForm 
                  onSuccess={() => {
                    setShowCreateForm(false);
                    refetch();
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              </Card>
            )}

            {editingAdId && (
              <Card className="p-6">
                <AdForm 
                  ad={ads?.find(ad => ad.id === editingAdId)}
                  onSuccess={() => {
                    setEditingAdId(null);
                    refetch();
                  }}
                  onCancel={() => setEditingAdId(null)}
                />
              </Card>
            )}

            {!isLoading && !editingAdId && !showCreateForm && (
              <AdsList 
                ads={ads || []} 
                onEdit={handleEdit}
                onDeleteAd={handleDelete}
              />
            )}
          </TabsContent>

          <TabsContent value="types">
            <AdTypesTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Ads;