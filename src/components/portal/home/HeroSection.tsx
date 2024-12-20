import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: heroSections } = useQuery({
    queryKey: ["hero-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_sections")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (heroSections && heroSections.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSections.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(timer);
    }
  }, [heroSections]);

  if (!heroSections || heroSections.length === 0) {
    return null;
  }

  const currentHero = heroSections[currentSlide];

  return (
    <section className="relative bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-[#141413]">
              {currentHero.title.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {i === 1 ? (
                    <span className="bg-[#F0EFEA] px-2">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>
            <p className="text-xl text-[#828179] max-w-lg">
              {currentHero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-[#141413] text-white hover:bg-[#141413]/90"
                asChild
              >
                <a href={currentHero.primary_button_link}>
                  {currentHero.primary_button_text}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#141413] text-[#141413]"
                asChild
              >
                <a href={currentHero.secondary_button_link}>
                  {currentHero.secondary_button_text}
                </a>
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-4">
              {currentHero.app_store_link && (
                <a
                  href={currentHero.app_store_link}
                  className="hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/app-store.svg"
                    alt="Download on the App Store"
                    className="h-10"
                  />
                </a>
              )}
              {currentHero.play_store_link && (
                <a
                  href={currentHero.play_store_link}
                  className="hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/play-store.svg"
                    alt="Get it on Google Play"
                    className="h-10"
                  />
                </a>
              )}
            </div>
          </div>
          <div className="relative">
            {currentHero.hero_image && (
              <img
                src={currentHero.hero_image}
                alt="Reading experience"
                className="w-full object-cover rounded-2xl shadow-2xl"
              />
            )}
            {heroSections.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {heroSections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-[#141413] w-4"
                        : "bg-[#141413]/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};