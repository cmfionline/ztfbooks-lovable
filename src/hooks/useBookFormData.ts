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

  // Transform the data into the format expected by CreatableCombobox
  // Ensure we always return an array even if data is undefined
  const series = (seriesData || []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const authors = (authorsData || []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const publishers = (publishersData || []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const tags = (tagsData || []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const languages = (languagesData || []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const isLoading = 
    isLoadingSeries || 
    isLoadingAuthors || 
    isLoadingPublishers || 
    isLoadingTags || 
    isLoadingLanguages;

  // Return empty arrays if data is loading to prevent undefined
  return {
    series: isLoading ? [] : series,
    authors: isLoading ? [] : authors,
    publishers: isLoading ? [] : publishers,
    tags: isLoading ? [] : tags,
    languages: isLoading ? [] : languages,
    isLoading,
  };
};