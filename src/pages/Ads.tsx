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
        .select('*')
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

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Advertisements</h1>
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
                <Grid className="h-4 w-4" />
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
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-accent hover:bg-accent/90 text-primary font-medium focus:ring-2 focus:ring-accent/50"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {showForm ? 'Hide Form' : 'New Ad'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="ads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ads">Ads</TabsTrigger>
            <TabsTrigger value="types">Ad Types</TabsTrigger>
          </TabsList>

          <TabsContent value="ads" className="space-y-4">
            {showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create New Advertisement</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdForm onSuccess={() => {
                    setShowForm(false);
                    refetch();
                  }} />
                </CardContent>
              </Card>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
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
            <AdTypesList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Ads;