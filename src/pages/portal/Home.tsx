import { HomeAds } from "@/components/portal/ads/HomeAds";
import { FeaturedBooks } from "@/components/portal/home/FeaturedBooks";
import { HotDiscounts } from "@/components/portal/home/HotDiscounts";
import { PopularAuthors } from "@/components/portal/home/PopularAuthors";
import { PopularSeries } from "@/components/portal/home/PopularSeries";
import { RecentBooks } from "@/components/portal/home/RecentBooks";
import { RecentlyViewed } from "@/components/portal/home/RecentlyViewed";
import { TopSellingBooks } from "@/components/portal/home/TopSellingBooks";
import { TrendingBooks } from "@/components/portal/home/TrendingBooks";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section with Ads */}
      <section className="mb-12">
        <HomeAds />
      </section>

      {/* Featured Books Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-purple-900">Featured Books</h2>
        <FeaturedBooks />
      </section>

      {/* Hot Discounts */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-purple-900">Hot Discounts</h2>
        <HotDiscounts />
      </section>

      {/* Recently Viewed */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-purple-900">Recently Viewed</h2>
        <RecentlyViewed />
      </section>

      {/* Top Selling Books */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-purple-900">Top Selling</h2>
        <TopSellingBooks />
      </section>

      {/* Trending Books */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-purple-900">Trending Now</h2>
        <TrendingBooks />
      </section>

      {/* Recent Books */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-purple-900">New Arrivals</h2>
        <RecentBooks />
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Popular Authors */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-900">Popular Authors</h2>
          <PopularAuthors />
        </section>

        {/* Popular Series */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-900">Popular Series</h2>
          <PopularSeries />
        </section>
      </div>
    </div>
  );
};

export default Home;