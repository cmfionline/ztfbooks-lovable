import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const ContentBlocks = () => {
  const { data: contentBlocks, isLoading } = useQuery({
    queryKey: ["content-blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_blocks")
        .select("*")
        .eq("is_active", true)
        .order("order_index");

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {contentBlocks?.map((block) => (
        <section key={block.id} className="py-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {block.title}
              </h2>
              {block.subtitle && (
                <p className="mt-2 text-lg text-gray-600">{block.subtitle}</p>
              )}
              {block.description && (
                <p className="mt-4 text-gray-500">{block.description}</p>
              )}
              {block.button_text && block.button_link && (
                <div className="mt-8">
                  <Button asChild>
                    <a href={block.button_link}>{block.button_text}</a>
                  </Button>
                </div>
              )}
            </div>
            {block.image_url && (
              <div className="mt-8">
                <img
                  src={block.image_url}
                  alt={block.title}
                  className="rounded-lg shadow-xl"
                />
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
};