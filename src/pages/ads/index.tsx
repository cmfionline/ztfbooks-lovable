import { useState } from "react";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdForm } from "@/components/ads/form/AdForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { AdsList } from "@/components/ads/AdsList";
import { AdTypesTabContent } from "@/components/ads/tabs/AdTypesTabContent";

const Ads = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const handleEdit = (adId: string) => {
    setEditingAdId(adId);
    setShowCreateForm(false);
  };

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
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-background border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "focus:ring-2 focus:ring-purple/50",
                  viewMode === 'grid' && "bg-purple hover:bg-purple/90 text-white"
                )}
              >
                <Grid className="icon" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={cn(
                  "focus:ring-2 focus:ring-purple/50",
                  viewMode === 'list' && "bg-purple hover:bg-purple/90 text-white"
                )}
              >
                <List className="icon" />
              </Button>
            </div>
            <Button 
              onClick={() => {
                setShowCreateForm(v => !v);
                setEditingAdId(null);
              }}
              className="bg-purple hover:bg-purple/90 text-white"
            >
              {showCreateForm ? 'Cancel' : 'New Ad'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="ads" className="space-y-4">
          <TabsList className="tabs-list">
            <TabsTrigger value="ads" className="tab">Ads</TabsTrigger>
            <TabsTrigger value="types" className="tab">Ad Types</TabsTrigger>
          </TabsList>

          <TabsContent value="ads" className="space-y-6">
            {showCreateForm && (
              <AdForm 
                onSuccess={() => setShowCreateForm(false)}
                onCancel={() => setShowCreateForm(false)}
              />
            )}

            {editingAdId && (
              <AdForm 
                ad={ads?.find(ad => ad.id === editingAdId)}
                onSuccess={() => setEditingAdId(null)}
                onCancel={() => setEditingAdId(null)}
              />
            )}

            {!isLoading && !showCreateForm && !editingAdId && (
              <AdsList 
                ads={ads || []} 
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
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