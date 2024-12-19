import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const adStyles = [
  "bg-gradient-to-r from-purple-100 to-purple-50 border-purple-200",
  "bg-gradient-to-r from-blue-100 to-blue-50 border-blue-200",
  "bg-gradient-to-r from-pink-100 to-pink-50 border-pink-200",
  "bg-gradient-to-r from-green-100 to-green-50 border-green-200",
];

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {ads.map((ad, index) => (
        <Card 
          key={ad.id} 
          className={`${adStyles[index % adStyles.length]} border hover:shadow-md transition-shadow`}
        >
          <CardContent className="flex items-center gap-4 p-4">
            {ad.image_url && (
              <img 
                src={ad.image_url} 
                alt={ad.name}
                className="w-20 h-20 object-cover rounded-lg shadow-sm"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 truncate">{ad.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{ad.content}</p>
              {ad.cta_text && (
                <Button 
                  variant="ghost" 
                  className="mt-2 p-0 h-auto text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-transparent"
                >
                  {ad.cta_text}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};