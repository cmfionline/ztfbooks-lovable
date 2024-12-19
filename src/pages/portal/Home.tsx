import { HomeAds } from "@/components/portal/ads/HomeAds";
import { FeaturedBooks } from "@/components/portal/home/FeaturedBooks";
import { HotDiscounts } from "@/components/portal/home/HotDiscounts";
import { PopularAuthors } from "@/components/portal/home/PopularAuthors";
import { PopularSeries } from "@/components/portal/home/PopularSeries";
import { RecentBooks } from "@/components/portal/home/RecentBooks";
import { RecentlyViewed } from "@/components/portal/home/RecentlyViewed";
import { TopSellingBooks } from "@/components/portal/home/TopSellingBooks";
import { TrendingBooks } from "@/components/portal/home/TrendingBooks";
import { PromotedBooks } from "@/components/portal/home/PromotedBooks";
import { CategoryAds } from "@/components/portal/ads/CategoryAds";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Main Ads */}
      <section className="relative">
        <HomeAds />
      </section>

      {/* Featured & Promotional Content */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Special Offers Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-900">Special Offers</h2>
            <PromotedBooks />
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-900">Hot Discounts</h2>
            <HotDiscounts />
          </div>
        </section>

        {/* Category-specific Ads */}
        <section className="bg-purple-50/50 -mx-4 px-4 py-8">
          <div className="container mx-auto">
            <CategoryAds />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-12">
          {/* Featured & Recent */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-900">Featured Books</h2>
              <FeaturedBooks />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-900">New Arrivals</h2>
              <RecentBooks />
            </div>
          </section>

          {/* Recently Viewed & Top Selling */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-900">Recently Viewed</h2>
              <RecentlyViewed />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-900">Top Selling</h2>
              <TopSellingBooks />
            </div>
          </section>

          {/* Trending Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-900">Trending Now</h2>
            <TrendingBooks />
          </section>

          {/* Authors & Series Grid */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-900">Popular Authors</h2>
              <PopularAuthors />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-900">Popular Series</h2>
              <PopularSeries />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;