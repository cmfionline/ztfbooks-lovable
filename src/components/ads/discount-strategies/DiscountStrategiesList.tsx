import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import CreateDiscountStrategyDialog from "./CreateDiscountStrategyDialog";

export const DiscountStrategiesList = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Discount Strategies</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Strategy
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Percentage Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Apply a percentage discount to selected books or categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fixed Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Apply a fixed amount discount to selected items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Offer discounts based on quantity purchased
            </p>
          </CardContent>
        </Card>
      </div>

      <CreateDiscountStrategyDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
};