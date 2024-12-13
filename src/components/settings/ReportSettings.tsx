import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileDown } from "lucide-react";

export const ReportSettings = () => {
  const [templates, setTemplates] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [templatesResponse, scheduledResponse] = await Promise.all([
          supabase
            .from('report_templates')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('scheduled_reports')
            .select('*')
            .order('created_at', { ascending: false })
        ]);

        if (templatesResponse.error) throw templatesResponse.error;
        if (scheduledResponse.error) throw scheduledResponse.error;

        setTemplates(templatesResponse.data || []);
        setScheduledReports(scheduledResponse.data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load report data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchReportData();
  }, [toast]);

  const handleExport = async (format: 'pdf' | 'excel') => {
    // Implementation for export functionality
    toast({
      title: "Export Started",
      description: `Your report will be exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Create and manage report templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Template Name</Label>
            <Input placeholder="Enter template name" />
          </div>
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="users">User Activity Report</SelectItem>
                <SelectItem value="books">Book Analytics Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleExport('pdf')} className="flex-1">
              <FileDown className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button onClick={() => handleExport('excel')} className="flex-1">
              <FileDown className="mr-2 h-4 w-4" />
              Export as Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Configure automated report generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Report Template</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Schedule</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full">Schedule Report</Button>
        </CardContent>
      </Card>
    </div>
  );
};