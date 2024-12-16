import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Book } from "lucide-react";

const PortalHome = () => {
  const { data: featuredBooks } = useQuery({
    queryKey: ["featured-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name),
          languages (name)
        `)
        .eq("is_featured", true)
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-6 text-2xl font-bold">Featured Books</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBooks?.map((book) => (
            <Card key={book.id} className="p-4">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted">
                  <Book className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="mt-4">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {book.authors?.name}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortalHome;