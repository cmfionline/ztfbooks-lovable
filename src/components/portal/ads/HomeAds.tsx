import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {ads.map((ad) => (
        <Card key={ad.id} className="overflow-hidden">
          <CardContent className="p-0">
            {ad.image_url && (
              <img 
                src={ad.image_url} 
                alt={ad.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold mb-2">{ad.name}</h3>
              <p className="text-sm text-gray-600">{ad.content}</p>
              {ad.cta_text && (
                <a 
                  href="#" 
                  className="inline-block mt-4 px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple/90 transition-colors"
                >
                  {ad.cta_text}
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};