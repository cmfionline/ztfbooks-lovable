import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const EmailTemplateSettings = () => {
  const [isCreating, setIsCreating] = useState(false);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>Manage your email templates</CardDescription>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-purple hover:bg-purple-dark text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No email templates found. Create one to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {templates?.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.subject}</p>
                </div>
                <Button variant="ghost" className="text-purple hover:text-purple-dark">
                  Edit
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};