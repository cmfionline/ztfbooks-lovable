import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Book } from "lucide-react";

const PortalLibrary = () => {
  const { data: books } = useQuery({
    queryKey: ["user-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          reading_progress (current_page, total_pages)
        `)
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Library</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {books?.map((book) => (
          <Card key={book.id} className="p-4">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                className="aspect-[3/4] w-full object-cover rounded-md"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted rounded-md">
                <Book className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="mt-4">
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-muted-foreground">
                by {book.authors?.name}
              </p>
              {book.reading_progress?.[0] && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Progress: {Math.round((book.reading_progress[0].current_page / book.reading_progress[0].total_pages) * 100)}%
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortalLibrary;