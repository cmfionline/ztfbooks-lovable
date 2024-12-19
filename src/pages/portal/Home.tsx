import { HomeAds } from "@/components/portal/ads/HomeAds";
import { FeaturedBooks } from "@/components/portal/home/FeaturedBooks";
import { PopularAuthors } from "@/components/portal/home/PopularAuthors";
import { PopularSeries } from "@/components/portal/home/PopularSeries";
import { RecentBooks } from "@/components/portal/home/RecentBooks";
import { TopSellingBooks } from "@/components/portal/home/TopSellingBooks";
import { PromotedBooks } from "@/components/portal/home/PromotedBooks";
import { CategoryAds } from "@/components/portal/ads/CategoryAds";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Main Ads */}
      <section className="relative bg-background">
        <HomeAds />
      </section>

      {/* Special Offers - Auto-scrolling Cards */}
      <section className="py-8 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Special Offers</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">
              View all
            </a>
          </div>
          <PromotedBooks />
        </div>
      </section>

      {/* Category-specific Ads */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <CategoryAds />
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-8 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Featured</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <FeaturedBooks />
        </div>
      </section>

      {/* New Releases */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">New Releases</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <RecentBooks />
        </div>
      </section>

      {/* Popular Authors */}
      <section className="py-8 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Popular Authors</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <PopularAuthors />
        </div>
      </section>

      {/* Popular Series */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Popular Series</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <PopularSeries />
        </div>
      </section>

      {/* Top Selling */}
      <section className="py-8 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Top Selling</h2>
            <a href="#" className="text-sm text-purple hover:text-purple-dark">View all</a>
          </div>
          <TopSellingBooks />
        </div>
      </section>
    </div>
  );
};

export default Home;