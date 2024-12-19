import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DiscountStrategyForm } from "./form/DiscountStrategyForm";
import { toast } from "@/hooks/use-toast";

export const DiscountStrategiesList = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStrategy, setEditingStrategy] = useState<any>(null);

  const { data: strategies, isLoading, refetch } = useQuery({
    queryKey: ['discountStrategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_strategies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching discount strategies",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data;
    },
  });

  const filteredStrategies = strategies?.filter(strategy =>
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('discount_strategies')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete discount strategy",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Discount strategy deleted successfully",
    });
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discount Strategies</h2>
        <Button 
          onClick={() => {
            setEditingStrategy(null);
            setShowForm(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Strategy
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-6 bg-card">
          <DiscountStrategyForm
            onSuccess={() => {
              setShowForm(false);
              setEditingStrategy(null);
              refetch();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingStrategy(null);
            }}
            editingStrategy={editingStrategy}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search strategies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min. Purchase</TableHead>
              <TableHead>Min. Books</TableHead>
              <TableHead>Stackable</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStrategies?.map((strategy) => (
              <TableRow key={strategy.id}>
                <TableCell className="font-medium">{strategy.name}</TableCell>
                <TableCell className="capitalize">{strategy.type}</TableCell>
                <TableCell>
                  {strategy.value}{strategy.type === 'percentage' ? '%' : ''}
                </TableCell>
                <TableCell>${strategy.min_purchase_amount || 0}</TableCell>
                <TableCell>{strategy.min_books_count || 0}</TableCell>
                <TableCell>{strategy.is_stackable ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingStrategy(strategy);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(strategy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};