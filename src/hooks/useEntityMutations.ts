import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useEntityMutations = () => {
  const queryClient = useQueryClient();

  const createSeries = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("series")
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });

  const createAuthor = useMutation({
    mutationFn: async (values: {
      name: string;
      nationality?: string;
      photo?: string;
      bio?: string;
      website?: string;
      facebook_url?: string;
      twitter_url?: string;
      instagram_url?: string;
      date_of_birth?: string;
      mobile?: string;
      address?: string;
    }) => {
      console.log("Creating author with values:", values);
      
      const { data, error } = await supabase
        .from("authors")
        .insert(values)
        .select("*")
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Author created successfully:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });

  const createPublisher = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("publishers")
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers"] });
    },
  });

  const createTag = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("tags")
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  return {
    createSeries,
    createAuthor,
    createPublisher,
    createTag,
  };
};