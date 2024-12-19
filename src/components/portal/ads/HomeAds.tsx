import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const HomeAds = () => {
  const { data: ads } = useQuery({
    queryKey: ['portal-ads', 'home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('placement', 'home')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .lte('start_date', new Date().toISOString());

      if (error) throw error;
      return data;
    },
  });

  if (!ads?.length) return null;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-[1400px] mx-auto"
    >
      <CarouselContent>
        {ads.map((ad) => (
          <CarouselItem key={ad.id} className="basis-full lg:basis-1/2">
            <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-lg">
              {ad.image_url ? (
                <div className="absolute inset-0">
                  <img
                    src={ad.image_url}
                    alt={ad.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-900" />
              )}

              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <div className="space-y-4 max-w-lg">
                  {ad.html_content ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: ad.html_content }}
                      className="prose prose-invert max-w-none"
                    />
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold tracking-tight">{ad.name}</h3>
                      <p className="text-sm text-gray-200 line-clamp-2">{ad.content}</p>
                    </>
                  )}
                  
                  {ad.cta_text && (
                    <Button 
                      variant="secondary" 
                      className="mt-4 group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
                    >
                      {ad.cta_text}
                      <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};