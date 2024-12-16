import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBookFormData = (options = {}) => {
  const { toast } = useToast();

  const { data: seriesData, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["series"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("series")
        .select("*")
        .order("name")
        .abortSignal(signal);
      
      if (error) {
        toast({
          title: "Error fetching series",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

  const { data: authorsData, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name")
        .abortSignal(signal);
      
      if (error) {
        toast({
          title: "Error fetching authors",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  const { data: publishersData, isLoading: isLoadingPublishers } = useQuery({
    queryKey: ["publishers"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("publishers")
        .select("*")
        .order("name")
        .abortSignal(signal);
      
      if (error) {
        toast({
          title: "Error fetching publishers",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  const { data: tagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name")
        .abortSignal(signal);
      
      if (error) {
        toast({
          title: "Error fetching tags",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  const { data: languagesData, isLoading: isLoadingLanguages } = useQuery({
    queryKey: ["languages"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name")
        .abortSignal(signal);
      
      if (error) {
        toast({
          title: "Error fetching languages",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    ...options,
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
