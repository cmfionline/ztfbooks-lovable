import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { AdForm } from "@/components/ads/form/AdForm";
import { AdsList } from "@/components/ads/AdsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdTypesTabContent } from "@/components/ads/tabs/AdTypesTabContent";

const Ads = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: ads, isLoading, refetch } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select(`
          id,
          name,
          type,
          placement,
          content,
          html_content,
          start_date,
          end_date,
          cta_text,
          discount_strategy_id,
          image_url,
          video_url,
          is_active,
          target_audience,
          discount_type,
          discount_value,
          min_purchase_amount,
          min_books_count,
          is_stackable,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching ads",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const handleDeleteAd = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting ad",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "The ad has been successfully deleted.",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAdCreated = () => {
    setShowForm(false);
    refetch();
    toast({
      title: "Ad Created Successfully",
      description: "Your new advertisement has been created and is now live.",
      variant: "default",
    });
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
            {!showForm && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-purple hover:bg-purple/90 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Ad
                </Button>
              </div>
            )}

            {showForm && (
              <Card className="p-6">
                <AdForm 
                  onSuccess={handleAdCreated}
                  onCancel={() => setShowForm(false)}
                />
              </Card>
            )}

            {!isLoading && !showForm && (
              <AdsList 
                ads={ads || []} 
                onDeleteAd={handleDeleteAd}
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