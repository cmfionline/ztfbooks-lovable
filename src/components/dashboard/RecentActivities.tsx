import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  activity_type: string;
  created_at: string;
  books: {
    title: string;
  };
}

const RecentActivities = () => {
  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ['recent-activities'],
    queryFn: async ({ signal }) => {
      try {
        const { data, error } = await supabase
          .from('customer_activities')
          .select(`
            id,
            activity_type,
            created_at,
            books (
              title
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5)
          .abortSignal(signal);

        if (error) throw error;
        return data as Activity[];
      } catch (error: any) {
        console.error('Error fetching recent activities:', error);
        throw new Error(error.message);
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    toast({
      title: "Error loading activities",
      description: "Failed to load recent activities. Please try again later.",
      variant: "destructive",
    });
  }

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-purple" />
          </div>
        ) : activities?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activities found.</p>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {formatActivityType(activity.activity_type)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.books?.title}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(activity.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;