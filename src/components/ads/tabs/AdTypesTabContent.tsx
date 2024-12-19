import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { AdTypesList } from "@/components/ads/types/AdTypesList";

export const AdTypesTabContent = () => {
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

  return isLoadingAdTypes ? (
    <div className="flex justify-center items-center h-32">
      <div className="loading w-8 h-8 border-b-2 border-purple rounded-full"></div>
    </div>
  ) : (
    <AdTypesList 
      adTypes={adTypes || []}
      onDeleteAdType={handleDeleteAdType}
    />
  );
};