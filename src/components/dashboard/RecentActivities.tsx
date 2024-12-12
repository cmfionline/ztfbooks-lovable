import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const RecentActivities = () => {
  const { data: activities } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_activities")
        .select(`
          *,
          profiles (
            full_name
          ),
          books (
            title
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return data || [];
    },
  });

  const getActivityMessage = (activity: any) => {
    switch (activity.activity_type) {
      case "purchase":
        return `purchased ${activity.books?.title}`;
      case "review":
        return `reviewed ${activity.books?.title}`;
      case "download":
        return `downloaded ${activity.books?.title}`;
      default:
        return `interacted with ${activity.books?.title}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">
                    {activity.profiles?.full_name}
                  </span>{" "}
                  {getActivityMessage(activity)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;