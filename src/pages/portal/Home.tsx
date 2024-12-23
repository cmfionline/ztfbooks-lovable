import { HomeAds } from "@/components/portal/ads/HomeAds";
import { FeaturedBooks } from "@/components/portal/home/FeaturedBooks";
import { PopularAuthors } from "@/components/portal/home/PopularAuthors";
import { PopularSeries } from "@/components/portal/home/PopularSeries";
import { RecentBooks } from "@/components/portal/home/RecentBooks";
import { TopSellingBooks } from "@/components/portal/home/TopSellingBooks";
import { PromotedBooks } from "@/components/portal/home/PromotedBooks";
import { BestsellingBooks } from "@/components/portal/home/BestsellingBooks";
import { EditorsPicksBooks } from "@/components/portal/home/EditorsPicksBooks";
import { HeroSection } from "@/components/portal/home/HeroSection";
import { SectionContainer } from "@/components/portal/home/SectionContainer";
import { SectionHeader } from "@/components/portal/home/SectionHeader";
import { HotDiscounts } from "@/components/portal/home/HotDiscounts";
import { TrendingBooks } from "@/components/portal/home/TrendingBooks";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero Section with Featured Book */}
      <HeroSection />

      {/* Hot Discounts Carousel */}
      <SectionContainer>
        <SectionHeader 
          title="Hot Discounts" 
          description="Limited time offers you don't want to miss"
        />
        <HotDiscounts />
      </SectionContainer>

      {/* Trending Now Grid */}
      <SectionContainer background="light">
        <SectionHeader 
          title="Trending Now" 
          description="Books everyone's talking about"
        />
        <TrendingBooks />
      </SectionContainer>

      {/* Bestselling Books */}
      <SectionContainer>
        <SectionHeader 
          title="Bestselling Books" 
          description="Our most popular reads"
        />
        <BestsellingBooks />
      </SectionContainer>

      {/* Editors' Picks */}
      <SectionContainer background="light">
        <SectionHeader 
          title="Editors' Picks" 
          description="Handpicked by our editorial team"
        />
        <EditorsPicksBooks />
      </SectionContainer>

      {/* Continue Reading */}
      <SectionContainer>
        <SectionHeader 
          title="Continue Reading" 
          description="Pick up where you left off"
        />
        <RecentBooks />
      </SectionContainer>

      {/* Popular Series */}
      <SectionContainer background="light">
        <SectionHeader 
          title="Popular Series" 
          description="Dive into captivating book series"
        />
        <PopularSeries />
      </SectionContainer>

      {/* Featured Authors */}
      <SectionContainer>
        <SectionHeader 
          title="Featured Authors" 
          description="Meet the creative minds behind your favorite books"
        />
        <PopularAuthors />
      </SectionContainer>

      {/* Special Offers */}
      <SectionContainer background="light">
        <SectionHeader 
          title="Special Offers" 
          description="Exclusive deals and promotions"
        />
        <PromotedBooks />
      </SectionContainer>

      {/* Home Ads Section */}
      <HomeAds />
    </div>
  );
};

export default Home;