import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface BookFormData {
  series: { label: string; value: string }[];
  authors: { label: string; value: string }[];
  publishers: { label: string; value: string }[];
  tags: { label: string; value: string }[];
  languages: { label: string; value: string }[];
  isLoading: boolean;
  error: Error | null;
}

export const useBookFormData = (options?: {
  retry?: number;
  retryDelay?: (attemptIndex: number) => number;
  staleTime?: number;
}): BookFormData => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bookFormData"],
    queryFn: async () => {
      const [
        { data: series },
        { data: authors },
        { data: publishers },
        { data: tags },
        { data: languages },
      ] = await Promise.all([
        supabase.from("series").select("id, name"),
        supabase.from("authors").select("id, name"),
        supabase.from("publishers").select("id, name"),
        supabase.from("tags").select("id, name"),
        supabase.from("languages").select("id, name"),
      ]);

      return {
        series: (series || []).map((s) => ({ label: s.name, value: s.id })),
        authors: (authors || []).map((a) => ({ label: a.name, value: a.id })),
        publishers: (publishers || []).map((p) => ({ label: p.name, value: p.id })),
        tags: (tags || []).map((t) => ({ label: t.name, value: t.id })),
        languages: (languages || []).map((l) => ({ label: l.name, value: l.id })),
      };
    },
    ...options,
  });

  return {
    series: data?.series || [],
    authors: data?.authors || [],
    publishers: data?.publishers || [],
    tags: data?.tags || [],
    languages: data?.languages || [],
    isLoading,
    error: error as Error | null,
  };
};