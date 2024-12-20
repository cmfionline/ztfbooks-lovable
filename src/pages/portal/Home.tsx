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
import { ContentBlocks } from "@/components/portal/home/ContentBlocks";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <HeroSection />
      <ContentBlocks />

      {/* Featured Books Carousel */}
      <SectionContainer>
        <FeaturedBooks />
      </SectionContainer>

      {/* Bestselling Books Grid */}
      <SectionContainer background="light">
        <BestsellingBooks />
      </SectionContainer>

      {/* Editors' Picks */}
      <SectionContainer>
        <EditorsPicksBooks />
      </SectionContainer>

      {/* Continue Reading Section */}
      <SectionContainer background="light">
        <SectionHeader 
          title="Pick up where you left off" 
          description="Continue reading your books"
        />
        <RecentBooks />
      </SectionContainer>

      {/* Popular Series */}
      <SectionContainer>
        <SectionHeader 
          title="Popular Series" 
          description="Explore our curated series collections"
        />
        <PopularSeries />
      </SectionContainer>

      {/* Popular Authors */}
      <SectionContainer background="light">
        <SectionHeader 
          title="Popular Authors" 
          description="Meet the minds behind the books"
        />
        <PopularAuthors />
      </SectionContainer>

      {/* Special Offers */}
      <SectionContainer>
        <SectionHeader 
          title="Special Offers" 
          description="Limited time deals on great books"
        />
        <PromotedBooks />
      </SectionContainer>
    </div>
  );
};

export default Home;