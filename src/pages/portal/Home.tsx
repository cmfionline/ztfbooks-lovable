import { Button } from "@/components/ui/button";
import { FeaturedBooks } from "@/components/portal/home/FeaturedBooks";
import { TrendingBooks } from "@/components/portal/home/TrendingBooks";
import { TopSellingBooks } from "@/components/portal/home/TopSellingBooks";
import { RecentlyViewed } from "@/components/portal/home/RecentlyViewed";
import { PopularSeries } from "@/components/portal/home/PopularSeries";
import { PopularAuthors } from "@/components/portal/home/PopularAuthors";
import { RecentBooks } from "@/components/portal/home/RecentBooks";
import { BookOpen, TrendingUp, Star, Clock, Library, Users, Book } from "lucide-react";

const PortalHome = () => {
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative h-[500px] -mt-6 rounded-b-3xl bg-gradient-to-r from-purple-600 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570')] opacity-20 bg-cover bg-center" />
        <div className="relative z-10 flex flex-col justify-center h-full px-8 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-white max-w-2xl">
            Discover Your Next Great Read
          </h1>
          <p className="text-xl mb-8 text-white/80 max-w-2xl">
            Explore thousands of eBooks and audiobooks. Read or listen anytime, anywhere.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90">
              Start Reading
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Browse Library
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 text-purple-500" />
              Featured Books
            </h2>
            <p className="text-muted-foreground">Handpicked selections just for you</p>
          </div>
          <Button variant="link">View All</Button>
        </div>
        <FeaturedBooks />
      </section>

      {/* Popular Series Section */}
      <section className="px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Library className="h-6 w-6 text-purple-500" />
              Popular Series
            </h2>
            <p className="text-muted-foreground">Explore our curated series</p>
          </div>
          <Button variant="link">View All</Button>
        </div>
        <PopularSeries />
      </section>

      {/* Popular Authors Section */}
      <section className="px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-500" />
              Popular Authors
            </h2>
            <p className="text-muted-foreground">Meet our distinguished authors</p>
          </div>
          <Button variant="link">View All</Button>
        </div>
        <PopularAuthors />
      </section>

      {/* Recent Books Section */}
      <section className="px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Book className="h-6 w-6 text-purple-500" />
              Recent Books
            </h2>
            <p className="text-muted-foreground">Fresh additions to our library</p>
          </div>
          <Button variant="link">View All</Button>
        </div>
        <RecentBooks />
      </section>

      {/* New & Trending Section */}
      <section className="px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-500" />
              New & Trending
            </h2>
            <p className="text-muted-foreground">Hot off the press</p>
          </div>
          <Button variant="link">View All</Button>
        </div>
        <TrendingBooks />
      </section>

      {/* Top Selling & Recently Viewed Grid */}
      <div className="px-8 max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        {/* Top Selling Section */}
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-500" />
              Top Selling
            </h2>
            <Button variant="link">View All</Button>
          </div>
          <TopSellingBooks />
        </div>

        {/* Recently Viewed Section */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6 text-purple-500" />
              Recently Viewed
            </h2>
            <Button variant="link">View All</Button>
          </div>
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
};

export default PortalHome;