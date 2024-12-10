import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Eye, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import CreateAdDialog from "@/components/ads/CreateAdDialog";
import { toast } from "@/hooks/use-toast";

const Ads = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: ads, isLoading } = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select(`
          *,
          ad_books (
            book_id,
            discount_percentage
          )
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
      title: "Ad deleted",
      description: "The ad has been successfully deleted.",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Advertisements</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ad
          </Button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ads?.map((ad) => (
              <Card key={ad.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{ad.name}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteAd(ad.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Type: {ad.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Placement: {ad.placement}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Active: {ad.is_active ? "Yes" : "No"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duration: {format(new Date(ad.start_date), 'PP')} - {format(new Date(ad.end_date), 'PP')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CreateAdDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
        />
      </div>
    </div>
  );
};

export default Ads;