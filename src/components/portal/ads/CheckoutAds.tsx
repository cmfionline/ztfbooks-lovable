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
    <div className="space-y-2">
      {ads.map((ad) => (
        <Card key={ad.id} className="bg-purple-50/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {ad.image_url && (
                <img 
                  src={ad.image_url} 
                  alt={ad.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-medium text-sm text-purple mb-0.5">{ad.name}</h3>
                <p className="text-xs text-gray-600">{ad.content}</p>
                {ad.cta_text && (
                  <a 
                    href="#" 
                    className="inline-block mt-1 text-xs text-purple hover:underline"
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