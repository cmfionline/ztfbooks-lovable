import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBookFormData = () => {
  const { data: series = [] } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const { data } = await supabase.from("series").select("*");
      return data?.map(s => ({ value: s.id, label: s.name })) || [];
    },
  });

  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data } = await supabase.from("authors").select("*");
      return data?.map(a => ({ value: a.id, label: a.name })) || [];
    },
  });

  const { data: publishers = [] } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const { data } = await supabase.from("publishers").select("*");
      return data?.map(p => ({ value: p.id, label: p.name })) || [];
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await supabase.from("tags").select("*");
      return data?.map(t => ({ value: t.id, label: t.name })) || [];
    },
  });

  const { data: languages = [] } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await supabase.from("languages").select("*");
      return data?.map(l => ({ value: l.id, label: l.name })) || [];
    },
  });

  return {
    series,
    authors,
    publishers,
    tags,
    languages,
  };
};