import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { AdTypesList } from "@/components/ads/types/AdTypesList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdTypeForm } from "@/components/ads/types/AdTypeForm";

export const AdTypesTabContent = () => {
  const [showForm, setShowForm] = useState(false);

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
    } catch (error) {
      console.error('Error deleting ad type:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    toast({
      title: "Success",
      description: "Ad type created successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-purple hover:bg-purple/90 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Ad Type
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6">
          <AdTypeForm 
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

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
    </div>
  );
};