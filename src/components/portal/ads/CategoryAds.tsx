import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

export const CategoryAds = () => {
  const { data: ads } = useQuery({
    queryKey: ['portal-ads', 'category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('placement', 'category')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .lte('start_date', new Date().toISOString());

      if (error) throw error;
      return data;
    },
  });

  if (!ads?.length) return null;

  return (
    <div className="grid gap-4">
      {ads.map((ad) => (
        <Card key={ad.id}>
          <CardContent className="flex items-center gap-4 p-4">
            {ad.image_url && (
              <img 
                src={ad.image_url} 
                alt={ad.name}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-semibold mb-2">{ad.name}</h3>
              <p className="text-sm text-gray-600">{ad.content}</p>
              {ad.cta_text && (
                <a 
                  href="#" 
                  className="inline-block mt-2 text-purple hover:underline"
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