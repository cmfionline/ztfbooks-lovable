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
    <div className="min-h-screen bg-white">
      {/* Hero Section with Main Ads */}
      <section className="relative bg-background">
        <HomeAds />
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-12">
        {/* Featured & Promotional Content */}
        <section className="grid gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Special Offers</h2>
            <PromotedBooks />
          </div>
        </section>

        {/* Category-specific Ads - Compact Row */}
        <section className="py-6">
          <CategoryAds />
        </section>

        {/* Hot Discounts - Horizontal Scroll */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Hot Deals</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <HotDiscounts />
        </section>

        {/* Featured & Recent Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Featured</h2>
              <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
            </div>
            <FeaturedBooks />
          </section>
          
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">New Releases</h2>
              <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
            </div>
            <RecentBooks />
          </section>
        </div>

        {/* Trending Section - Full Width */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Trending Now</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <TrendingBooks />
        </section>

        {/* Recently Viewed & Top Selling Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recently Viewed</h2>
              <a href="#" className="text-sm text-purple hover:text-purple-dark">Clear</a>
            </div>
            <RecentlyViewed />
          </section>
          
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Top Selling</h2>
              <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
            </div>
            <TopSellingBooks />
          </section>
        </div>

        {/* Authors & Series Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Popular Authors</h2>
              <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
            </div>
            <PopularAuthors />
          </section>
          
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Popular Series</h2>
              <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
            </div>
            <PopularSeries />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;