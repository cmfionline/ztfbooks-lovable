import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { AdForm } from "@/components/ads/AdForm";
import { AdsList } from "@/components/ads/AdsList";

export const AdsTabContent = () => {
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
    <>
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

      <div className="flex justify-end mb-4">
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <PlusCircle className="icon mr-2" />
          {showForm ? 'Hide Form' : 'New Ad'}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="loading w-8 h-8 border-b-2 border-purple rounded-full"></div>
        </div>
      ) : (
        <AdsList 
          ads={ads || []} 
          onDeleteAd={handleDeleteAd}
        />
      )}
    </>
  );
};