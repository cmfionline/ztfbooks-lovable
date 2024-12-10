import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBookFormData = () => {
  const { data: seriesData, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("series")
        .select("*")
        .order("name");
      
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
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      
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
      const { data, error } = await supabase
        .from("publishers")
        .select("*")
        .order("name");
      
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
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
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
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");
      
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

  return {
    series: (seriesData || []).map((item) => ({
      label: item.name,
      value: item.id,
    })),
    authors: (authorsData || []).map((item) => ({
      label: item.name,
      value: item.id,
    })),
    publishers: (publishersData || []).map((item) => ({
      label: item.name,
      value: item.id,
    })),
    tags: (tagsData || []).map((item) => ({
      label: item.name,
      value: item.id,
    })),
    languages: (languagesData || []).map((item) => ({
      label: `${item.name} (${item.code})`,
      value: item.id,
    })),
    isLoading,
  };
};