import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Library } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PopularSeries = () => {
  const { data: seriesList, isLoading } = useQuery({
    queryKey: ["popular-series"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("series")
        .select(`
          *,
          languages (name)
        `)
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-[21/9] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {seriesList?.map((series) => {
        const imageUrl = series.image
          ? supabase.storage.from('books').getPublicUrl(series.image).data.publicUrl
          : null;

        return (
          <Card 
            key={series.id} 
            className="group relative overflow-hidden transition-all hover:scale-105"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={series.name}
                className="aspect-[21/9] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[21/9] w-full items-center justify-center bg-muted">
                <Library className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 p-2 text-white">
                <h3 className="text-sm font-semibold line-clamp-1">{series.name}</h3>
                <p className="text-xs text-white/80">{series.languages?.name}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};