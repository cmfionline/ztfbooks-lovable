import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";

export const CheckoutAds = () => {
  const { data: ads } = useQuery({
    queryKey: ['portal-ads', 'checkout'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('placement', 'checkout')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .lte('start_date', new Date().toISOString());

      if (error) throw error;
      return data;
    },
  });

  if (!ads?.length) return null;

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <Card key={ad.id} className="bg-purple-light/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {ad.image_url && (
                <img 
                  src={ad.image_url} 
                  alt={ad.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold text-purple mb-1">{ad.name}</h3>
                <p className="text-sm text-gray-600">{ad.content}</p>
                {ad.cta_text && (
                  <a 
                    href="#" 
                    className="inline-block mt-2 text-sm text-purple hover:underline"
                  >
                    {ad.cta_text}
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};