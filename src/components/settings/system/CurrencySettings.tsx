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
import { supabase } from "@/lib/supabase";
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

interface CurrencySettings {
  default: string;
  supported: string[];
}

export const CurrencySettings = () => {
  const { toast } = useToast();
  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ["currencySettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("category", "currency")
        .maybeSingle();
      
      if (error) throw error;
      const defaultSettings: CurrencySettings = {
        default: "USD",
        supported: ["USD"]
      };
      return data ? (data.settings as unknown as CurrencySettings) : defaultSettings;
    },
  });

  const handleSave = async (value: string) => {
    try {
      const { error } = await supabase
        .from("system_settings")
        .upsert({
          category: "currency",
          settings: {
            ...settings,
            default: value
          }
        }, {
          onConflict: "category"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Currency settings updated successfully",
        className: "bg-green-50 border-green-200",
      });
      refetch();
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update currency settings",
        variant: "destructive",
      });
    }
  };

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
          <Select 
            defaultValue={settings?.default}
            onValueChange={handleSave}
          >
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
      </CardContent>
    </Card>
  );
};