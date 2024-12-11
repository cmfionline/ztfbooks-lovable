import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateDiscountStrategyDialog from "./CreateDiscountStrategyDialog";

export const DiscountStrategiesList = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: strategies, isLoading } = useQuery({
    queryKey: ['discountStrategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_strategies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discount Strategies</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Strategy
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {strategies?.map((strategy) => (
          <div
            key={strategy.id}
            className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <h3 className="font-semibold">{strategy.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>Type: {strategy.type}</p>
              <p>Value: {strategy.value}{strategy.type === 'percentage' ? '%' : ''}</p>
              {strategy.min_purchase_amount > 0 && (
                <p>Min Purchase: ${strategy.min_purchase_amount}</p>
              )}
              {strategy.min_books_count > 0 && (
                <p>Min Books: {strategy.min_books_count}</p>
              )}
              <p>Stackable: {strategy.is_stackable ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ))}
      </div>

      <CreateDiscountStrategyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};