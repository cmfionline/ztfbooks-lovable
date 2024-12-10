import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBookFormData = () => {
  const { data: seriesData, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const { data, error } = await supabase.from("series").select("*");
      if (error) {
        console.error("Error fetching series:", error);
        return [];
      }
      return data || [];
    },
  });

  const { data: authorsData, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("authors").select("*");
      if (error) {
        console.error("Error fetching authors:", error);
        return [];
      }
      return data || [];
    },
  });

  const { data: publishersData, isLoading: isLoadingPublishers } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("publishers").select("*");
      if (error) {
        console.error("Error fetching publishers:", error);
        return [];
      }
      return data || [];
    },
  });

  const { data: tagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tags").select("*");
      if (error) {
        console.error("Error fetching tags:", error);
        return [];
      }
      return data || [];
    },
  });

  const { data: languagesData, isLoading: isLoadingLanguages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("languages").select("*");
      if (error) {
        console.error("Error fetching languages:", error);
        return [];
      }
      return data || [];
    },
  });

  const isLoading = 
    isLoadingSeries || 
    isLoadingAuthors || 
    isLoadingPublishers || 
    isLoadingTags || 
    isLoadingLanguages;

  // Transform the data into the format expected by CreatableCombobox
  // Return empty arrays during loading or if data is undefined
  return {
    series: isLoading ? [] : (seriesData || []).map((item) => ({
      label: item.name,
      value: item.id,
    })),
    authors: isLoading ? [] : (authorsData || []).map((item) => ({
      label: item.name,
      value: item.id,
    })),
    publishers: isLoading ? [] : (publishersData || []).map((item) => ({
      label: item.name,
      value: item.id,
    })),
    tags: isLoading ? [] : (tagsData || []).map((item) => ({
      label: item.name,
      value: item.id,
    })),
    languages: isLoading ? [] : (languagesData || []).map((item) => ({
      label: item.name,
      value: item.id,
    })),
    isLoading,
  };
};