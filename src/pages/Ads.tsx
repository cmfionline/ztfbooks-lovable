import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Grid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AdForm } from "@/components/ads/AdForm";
import { AdsList } from "@/components/ads/AdsList";
import { AdTypesList } from "@/components/ads/types/AdTypesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Ads = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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

  const { data: adTypes, isLoading: isLoadingAdTypes } = useQuery({
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

  const handleDeleteAdType = async (id: string) => {
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
        description: "The ad type has been successfully deleted.",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error('Error deleting ad type:', error);
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
          <div className="flex gap-4">
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
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              <PlusCircle className="icon mr-2" />
              {showForm ? 'Hide Form' : 'New Ad'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="ads" className="space-y-4">
          <TabsList className="tabs-list">
            <TabsTrigger value="ads" className="tab">Ads</TabsTrigger>
            <TabsTrigger value="types" className="tab">Ad Types</TabsTrigger>
          </TabsList>

          <TabsContent value="ads" className="space-y-4">
            {showForm && (
              <Card className="card">
                <CardHeader className="card-header">
                  <CardTitle>Create New Advertisement</CardTitle>
                </CardHeader>
                <CardContent className="card-content">
                  <AdForm onSuccess={handleAdCreated} />
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="loading w-8 h-8 border-b-2 border-purple rounded-full"></div>
              </div>
            ) : (
              <AdsList 
                ads={ads || []} 
                viewMode={viewMode} 
                onDeleteAd={handleDeleteAd}
              />
            )}
          </TabsContent>

          <TabsContent value="types">
            {isLoadingAdTypes ? (
              <div className="flex justify-center items-center h-32">
                <div className="loading w-8 h-8 border-b-2 border-purple rounded-full"></div>
              </div>
            ) : (
              <AdTypesList 
                adTypes={adTypes || []}
                onDeleteAdType={handleDeleteAdType}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Ads;