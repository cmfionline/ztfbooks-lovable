import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
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
  );
};