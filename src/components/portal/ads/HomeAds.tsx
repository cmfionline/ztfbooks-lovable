import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const HomeAds = () => {
  const { data: ads, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[400px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (!ads?.length) return null;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {ads.map((ad) => (
          <CarouselItem key={ad.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="overflow-hidden group relative h-[400px] border-none shadow-lg">
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

              <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
                <div className="space-y-4">
                  {ad.html_content ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: ad.html_content }}
                      className="prose prose-invert max-w-none"
                    />
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold tracking-tight">{ad.name}</h3>
                      <p className="text-sm text-gray-200 line-clamp-3">{ad.content}</p>
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
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};