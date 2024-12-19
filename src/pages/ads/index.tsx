import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdForm } from "@/components/ads/form/AdForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { AdsList } from "@/components/ads/AdsList";
import { AdTypesTabContent } from "@/components/ads/tabs/AdTypesTabContent";

const Ads = () => {
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  const { data: ads, isLoading } = useQuery({
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
    } catch (error: any) {
      console.error('Error deleting ad:', error);
    }
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
            {editingAdId && (
              <Card className="p-6">
                <AdForm 
                  ad={ads?.find(ad => ad.id === editingAdId)}
                  onSuccess={() => setEditingAdId(null)}
                  onCancel={() => setEditingAdId(null)}
                />
              </Card>
            )}

            {!isLoading && !editingAdId && (
              <AdsList 
                ads={ads || []} 
                onEdit={setEditingAdId}
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