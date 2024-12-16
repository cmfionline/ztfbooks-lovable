import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Book, Clock, Star, TrendingUp, Sparkles, BookOpen, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const PortalHome = () => {
  // Query for featured books
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
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  // Query for new & trending books
  const { data: trendingBooks } = useQuery({
    queryKey: ["trending-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  // Query for recently viewed
  const { data: recentlyViewed } = useQuery({
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

  // Query for top selling books
  const { data: topSelling } = useQuery({
    queryKey: ["top-selling"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (name)
        `)
        .eq("is_top_selling", true)
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-2xl bg-gradient-to-r from-purple-600 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570')] opacity-20 bg-cover bg-center" />
        <div className="relative z-10 flex flex-col justify-center h-full px-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to ZTF Books</h1>
          <p className="text-xl mb-8 max-w-2xl">Discover thousands of eBooks and audiobooks. Read or listen anytime, anywhere.</p>
          <Button className="w-fit bg-white text-purple-900 hover:bg-purple-50">Start Reading</Button>
        </div>
      </section>

      {/* New & Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              New & Trending
            </h2>
            <p className="text-muted-foreground">Recently released and buzz-y books.</p>
          </div>
          <Button variant="link">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingBooks?.map((book, index) => (
            <Card key={book.id} className={`p-4 ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="aspect-[3/4] w-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted rounded-lg">
                  <Book className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="mt-4">
                <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {book.authors?.name}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Paid Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-500" />
            Top Paid
          </h2>
          <Button variant="link">View All</Button>
        </div>
        <div className="space-y-4">
          {topSelling?.map((book, index) => (
            <div key={book.id} className="flex items-center gap-4 p-4 hover:bg-accent rounded-lg transition-colors">
              <span className="text-3xl font-bold text-muted-foreground w-8">{index + 1}</span>
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="h-24 w-16 object-cover rounded"
                />
              ) : (
                <div className="flex h-24 w-16 items-center justify-center bg-muted rounded">
                  <Book className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {book.authors?.name}
                </p>
                <p className="text-sm font-medium mt-1">
                  ${book.price?.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-purple-500" />
            Featured Books
          </h2>
          <Button variant="link">View All</Button>
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {featuredBooks?.map((book) => (
              <CarouselItem key={book.id} className="md:basis-1/2 lg:basis-1/4">
                <Card className="p-4">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="aspect-[3/4] w-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted rounded-lg">
                      <Book className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="mt-4">
                    <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      by {book.authors?.name}
                    </p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Recently Viewed Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-purple-500" />
            Recently Viewed
          </h2>
          <Button variant="link">View All</Button>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {recentlyViewed?.map((activity) => (
            <Card key={activity.id} className="p-4">
              {activity.books?.cover_image ? (
                <img
                  src={activity.books.cover_image}
                  alt={activity.books.title}
                  className="aspect-[3/4] w-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center bg-muted rounded-lg">
                  <Book className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="mt-4">
                <h3 className="font-semibold line-clamp-1">{activity.books?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {activity.books?.authors?.name}
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