import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const adStyles = [
  "bg-gradient-to-r from-purple-50 to-purple-100/50 border-purple-100",
  "bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-100",
  "bg-gradient-to-r from-pink-50 to-pink-100/50 border-pink-100",
  "bg-gradient-to-r from-green-50 to-green-100/50 border-green-100",
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
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {ads.map((ad, index) => (
        <Card 
          key={ad.id} 
          className={`${adStyles[index % adStyles.length]} border hover:shadow-sm transition-shadow`}
        >
          <CardContent className="flex items-center gap-4 p-4">
            {ad.image_url && (
              <img 
                src={ad.image_url} 
                alt={ad.name}
                className="w-16 h-16 object-cover rounded-lg shadow-sm"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 mb-1 truncate text-sm">{ad.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{ad.content}</p>
              {ad.cta_text && (
                <Button 
                  variant="ghost" 
                  className="mt-2 p-0 h-auto text-xs font-medium text-purple hover:text-purple-700 hover:bg-transparent"
                >
                  {ad.cta_text}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};