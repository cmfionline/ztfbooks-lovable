import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmailTemplateForm } from "./email-templates/EmailTemplateForm";
import { EmailTemplateList } from "./email-templates/EmailTemplateList";

export const EmailTemplateSettings = () => {
  const [isCreating, setIsCreating] = useState(false);

  const { data: templates, isLoading, refetch } = useQuery({
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

  const handleSuccess = () => {
    setIsCreating(false);
    refetch();
  };

  const handleEdit = (template: any) => {
    // TODO: Implement edit functionality
    console.log("Edit template:", template);
  };

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
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <Button 
            className="bg-purple hover:bg-purple-dark text-white"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Email Template</DialogTitle>
              <DialogDescription>
                Create a new email template for your communications
              </DialogDescription>
            </DialogHeader>
            <EmailTemplateForm 
              onSuccess={handleSuccess}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <EmailTemplateList 
          templates={templates}
          onEdit={handleEdit}
        />
      </CardContent>
    </Card>
  );
};