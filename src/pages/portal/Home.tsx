import { HomeAds } from "@/components/portal/ads/HomeAds";
import { FeaturedBooks } from "@/components/portal/home/FeaturedBooks";
import { PopularAuthors } from "@/components/portal/home/PopularAuthors";
import { PopularSeries } from "@/components/portal/home/PopularSeries";
import { RecentBooks } from "@/components/portal/home/RecentBooks";
import { TopSellingBooks } from "@/components/portal/home/TopSellingBooks";
import { PromotedBooks } from "@/components/portal/home/PromotedBooks";
import { CategoryAds } from "@/components/portal/ads/CategoryAds";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-background py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-primary">
                Read what you want,
                <br />
                <span className="bg-accent px-2">how you want.</span>
              </h1>
              <p className="text-xl text-text-secondary max-w-lg">
                Enjoy your library everywhere you go — even offline. Discover a world of knowledge at your fingertips.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                  Read free for 30 days
                </Button>
                <Button size="lg" variant="outline">
                  Browse Library
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img src="/app-store.svg" alt="Download on the App Store" className="h-10" />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img src="/play-store.svg" alt="Get it on Google Play" className="h-10" />
                </a>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/8f65c9bf-d2f0-4282-8bfc-b341572b5900.png" 
                alt="Reading experience" 
                className="w-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-primary">Featured Books</h2>
            <Button variant="ghost" className="text-primary">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <FeaturedBooks />
        </div>
      </section>

      {/* Continue Reading Section */}
      <section className="py-16 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-primary">Pick up where you left off</h2>
          </div>
          <RecentBooks />
        </div>
      </section>

      {/* Top Charts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-primary">Top Charts</h2>
          </div>
          <div className="flex gap-4 mb-8">
            <Button variant="secondary" className="bg-accent/10 text-primary hover:bg-accent/20">
              Top selling
            </Button>
            <Button variant="ghost">Deals</Button>
            <Button variant="ghost">Top free</Button>
          </div>
          <TopSellingBooks />
        </div>
      </section>

      {/* Popular Series */}
      <section className="py-16 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-primary">Popular Series</h2>
            <Button variant="ghost" className="text-primary">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <PopularSeries />
        </div>
      </section>

      {/* Popular Authors */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-primary">Popular Authors</h2>
            <Button variant="ghost" className="text-primary">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <PopularAuthors />
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-primary">Special Offers</h2>
            <Button variant="ghost" className="text-primary">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <PromotedBooks />
        </div>
      </section>
    </div>
  );
};

export default Home;