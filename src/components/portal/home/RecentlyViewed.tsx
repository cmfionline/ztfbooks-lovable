import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RecentlyViewed = () => {
  const { data: recentlyViewed, isLoading } = useQuery({
    queryKey: ["recently-viewed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_activities")
        .select(`
          *,
          books (
            *,
            authors (name)
          )
        `)
        .eq("activity_type", "view")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {recentlyViewed?.map((activity) => {
        const coverUrl = activity.books?.cover_image
          ? supabase.storage.from('books').getPublicUrl(activity.books.cover_image).data.publicUrl
          : null;

        return (
          <Card key={activity.id} className="group overflow-hidden">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={activity.books?.title}
                className="aspect-[2/3] w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center bg-muted">
                <Book className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold line-clamp-1">{activity.books?.title}</h3>
              <p className="text-sm text-muted-foreground">
                by {activity.books?.authors?.name}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};