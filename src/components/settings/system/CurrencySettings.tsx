import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface CurrencySettings {
  default: string;
  supported: string[];
}

export const CurrencySettings = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["currencySettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("category", "currency")
        .maybeSingle();
      
      if (error) throw error;
      return (data?.settings || {
        default: "USD",
        supported: ["USD"]
      }) as CurrencySettings;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>Configure your currency preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="defaultCurrency">Default Currency</Label>
          <Select defaultValue={settings?.default}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {settings?.supported.map((currency: string) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-purple hover:bg-purple-dark text-white">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};