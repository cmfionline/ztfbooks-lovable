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
        {/* Special Offers Cards - 3 in a row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PromotedBooks />
        </section>

        {/* Category-specific Ads - Compact Row */}
        <section className="py-6">
          <CategoryAds />
        </section>

        {/* Featured Books - Full Width Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Featured</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <div className="w-full">
            <FeaturedBooks />
          </div>
        </section>

        {/* New Releases - Full Width Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">New Releases</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <div className="w-full">
            <RecentBooks />
          </div>
        </section>

        {/* Popular Authors - Full Width Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Popular Authors</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <div className="w-full">
            <PopularAuthors />
          </div>
        </section>

        {/* Popular Series - Full Width Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Popular Series</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <div className="w-full">
            <PopularSeries />
          </div>
        </section>

        {/* Top Selling - Full Width Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Top Selling</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <div className="w-full">
            <TopSellingBooks />
          </div>
        </section>

        {/* Additional Sections */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recently Viewed</h2>
            <button className="text-sm text-purple hover:text-purple-dark">Clear</button>
          </div>
          <div className="w-full">
            <RecentlyViewed />
          </div>
        </section>

        {/* Trending Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Trending Now</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <div className="w-full">
            <TrendingBooks />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;