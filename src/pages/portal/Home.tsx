import { HomeAds } from "@/components/portal/ads/HomeAds";
import { FeaturedBooks } from "@/components/portal/home/FeaturedBooks";
import { PopularAuthors } from "@/components/portal/home/PopularAuthors";
import { PopularSeries } from "@/components/portal/home/PopularSeries";
import { RecentBooks } from "@/components/portal/home/RecentBooks";
import { TopSellingBooks } from "@/components/portal/home/TopSellingBooks";
import { PromotedBooks } from "@/components/portal/home/PromotedBooks";
import { BestsellingBooks } from "@/components/portal/home/BestsellingBooks";
import { EditorsPicksBooks } from "@/components/portal/home/EditorsPicksBooks";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Section */}
      <section className="relative bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-[#141413]">
                Read what you want,
                <br />
                <span className="bg-[#F0EFEA] px-2">how you want.</span>
              </h1>
              <p className="text-xl text-[#828179] max-w-lg">
                Enjoy your library everywhere you go — even offline. Discover a world of knowledge at your fingertips.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#141413] text-white hover:bg-[#141413]/90">
                  Read free for 30 days
                </Button>
                <Button size="lg" variant="outline" className="border-[#141413] text-[#141413]">
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
      <FeaturedBooks />

      {/* Bestselling Books Grid */}
      <BestsellingBooks />

      {/* Editors' Picks */}
      <EditorsPicksBooks />

      {/* Continue Reading Section */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#141413]">Pick up where you left off</h2>
          </div>
          <RecentBooks />
        </div>
      </section>

      {/* Popular Series */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#141413]">Popular Series</h2>
            <Button variant="ghost" className="text-[#141413]">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <PopularSeries />
        </div>
      </section>

      {/* Popular Authors */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#141413]">Popular Authors</h2>
            <Button variant="ghost" className="text-[#141413]">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <PopularAuthors />
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#141413]">Special Offers</h2>
            <Button variant="ghost" className="text-[#141413]">
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