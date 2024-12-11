import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Eye, Trash, Grid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AdForm } from "@/components/ads/AdForm";
import { DiscountAnalytics } from "@/components/ads/analytics/DiscountAnalytics";

const Ads = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showForm, setShowForm] = useState(false);

  const { data: ads, isLoading, refetch } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('id, name, type, placement, content, html_content, start_date, end_date, cta_text, image_url, video_url, is_active, discount_type, discount_value, min_purchase_amount, min_books_count')
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
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ads?.map((ad) => (
              <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{ad.name}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteAd(ad.id)}
                        className="hover:bg-red-50 text-red-600 focus:ring-2 focus:ring-red-500/50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Type: {ad.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Placement: {ad.placement}
                      </p>
                      {ad.discount_type && (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Discount: {ad.discount_type === 'percentage' ? `${ad.discount_value}%` : `$${ad.discount_value}`}
                          </p>
                          {ad.min_purchase_amount && (
                            <p className="text-sm text-muted-foreground">
                              Min Purchase: ${ad.min_purchase_amount}
                            </p>
                          )}
                          {ad.min_books_count && (
                            <p className="text-sm text-muted-foreground">
                              Min Books: {ad.min_books_count}
                            </p>
                          )}
                        </>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Duration: {format(new Date(ad.start_date), 'PP')} - {format(new Date(ad.end_date), 'PP')}
                      </p>
                    </div>
                    {ad.discount_type && (
                      <DiscountAnalytics adId={ad.id} />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {ads?.map((ad) => (
              <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">{ad.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ad.type} • {ad.placement} • {ad.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-purple-light/30 focus:ring-2 focus:ring-purple/50"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteAd(ad.id)}
                      className="hover:bg-red-50 text-red-600 focus:ring-2 focus:ring-red-500/50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ads;
