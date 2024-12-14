import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportTemplateForm } from "./reports/ReportTemplateForm";
import { ScheduledReportsForm } from "./reports/ScheduledReportsForm";

export const ReportSettings = () => {
  return (
    <div className="space-y-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Report Templates</CardTitle>
          <CardDescription>Create and manage report templates</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportTemplateForm />
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Scheduled Reports</CardTitle>
          <CardDescription>Configure automated report generation</CardDescription>
        </CardHeader>
        <CardContent>
          <ScheduledReportsForm />
        </CardContent>
      </Card>
    </div>
  );
};