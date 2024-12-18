import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const PopularAuthors = () => {
  const { data: authors, isLoading } = useQuery({
    queryKey: ["popular-authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {authors?.map((author) => {
        const photoUrl = author.photo
          ? supabase.storage.from('books').getPublicUrl(author.photo).data.publicUrl
          : null;

        return (
          <Card 
            key={author.id} 
            className="p-4 text-center group hover:bg-accent transition-colors"
          >
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={photoUrl || ""} alt={author.name} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{author.name}</h3>
            {author.designation && (
              <p className="text-sm text-muted-foreground mt-1">{author.designation}</p>
            )}
          </Card>
        );
      })}
    </div>
  );
};