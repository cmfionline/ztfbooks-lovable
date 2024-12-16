import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const PortalProfile = () => {
  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-purple/10 flex items-center justify-center">
              <User className="h-6 w-6 text-purple" />
            </div>
            <div>
              <h3 className="font-semibold">{profile?.full_name}</h3>
              <p className="text-sm text-muted-foreground">{profile?.location || "No location set"}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalProfile;