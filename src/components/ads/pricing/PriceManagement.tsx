import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";

interface PriceManagementProps {
  adId: string;
}

export const PriceManagement = ({ adId }: PriceManagementProps) => {
  const { data: priceData } = useQuery({
    queryKey: ['ad-prices', adId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_books')
        .select(`
          book_id,
          original_price,
          discounted_price,
          discount_percentage,
          discount_start_date,
          discount_end_date
        `)
        .eq('ad_id', adId);

      if (error) throw error;
      return data;
    },
  });

  if (!priceData?.length) return null;

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Price Information</h4>
          <div className="grid gap-2">
            {priceData.map((price) => (
              <div key={price.book_id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-muted-foreground">Original:</span>{' '}
                  {formatCurrency(price.original_price)}
                </div>
                <div>
                  <span className="text-muted-foreground">Discounted:</span>{' '}
                  <span className="text-green-600 font-medium">
                    {formatCurrency(price.discounted_price)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Discount:</span>{' '}
                  <span className="text-purple-600 font-medium">
                    {price.discount_percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};