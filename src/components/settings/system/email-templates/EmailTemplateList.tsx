import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
}

interface EmailTemplateListProps {
  templates: EmailTemplate[];
  onEdit: (template: EmailTemplate) => void;
}

export const EmailTemplateList = ({ templates, onEdit }: EmailTemplateListProps) => {
  if (templates?.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No email templates found. Create one to get started.
      </div>
    );
  }

  return (
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
          <Button 
            variant="ghost" 
            className="text-purple hover:text-purple-dark"
            onClick={() => onEdit(template)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};