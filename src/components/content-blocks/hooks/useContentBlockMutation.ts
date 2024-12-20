import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ContentBlock, ContentBlockFormValues, ContentBlockMutationContext } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useContentBlockMutation = (id?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ContentBlockFormValues): Promise<ContentBlock> => {
      if (id) {
        const { data, error } = await supabase
          .from("content_blocks")
          .update(values)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("content_blocks")
          .insert([values])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onMutate: async (newContentBlock: ContentBlockFormValues) => {
      await queryClient.cancelQueries({ queryKey: ["content-blocks"] });
      const previousBlocks = queryClient.getQueryData<ContentBlock[]>(["content-blocks"]) || [];

      // Optimistically update the cache
      queryClient.setQueryData<ContentBlock[]>(["content-blocks"], (old = []) => {
        const optimisticBlock: ContentBlock = {
          ...newContentBlock,
          id: id || "temp-id-" + Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (id) {
          return old.map((block) => (block.id === id ? optimisticBlock : block));
        }
        return [...old, optimisticBlock];
      });

      return { previousBlocks };
    },
    onError: (error: Error, _, context: ContentBlockMutationContext | undefined) => {
      if (context?.previousBlocks) {
        queryClient.setQueryData(["content-blocks"], context.previousBlocks);
      }
      toast({
        title: "Error",
        description: error.message || `Failed to ${id ? "update" : "create"} content block`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-blocks"] });
      toast({
        title: "Success",
        description: `Content block ${id ? "updated" : "created"} successfully`,
      });
    },
  });
};