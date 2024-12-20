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
      photo?: File | string;
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
      
      let photoPath = null;
      
      // Handle photo upload if it's a File
      if (values.photo instanceof File) {
        const fileExt = values.photo.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('books')
          .upload(`authors/${fileName}`, values.photo);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        photoPath = `authors/${fileName}`;
        console.log("File uploaded successfully:", photoPath);
      }

      // Clean up values before sending to API
      const authorData = {
        name: values.name.trim(),
        nationality: values.nationality || null,
        photo: photoPath,
        bio: values.bio || null,
        website: values.website || null,
        facebook_url: values.facebook_url || null,
        twitter_url: values.twitter_url || null,
        instagram_url: values.instagram_url || null,
        date_of_birth: values.date_of_birth || null,
        mobile: values.mobile || null,
        address: values.address || null,
      };

      console.log("Sending cleaned values to API:", authorData);
      
      const { data, error } = await supabase
        .from("authors")
        .insert(authorData)
        .select()
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