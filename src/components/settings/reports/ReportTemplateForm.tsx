import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileDown } from "lucide-react";
import { useUser } from "@supabase/auth-helpers-react";

const formSchema = z.object({
  templateName: z.string().min(2, "Template name must be at least 2 characters"),
  reportType: z.string().min(1, "Please select a report type"),
  format: z.string().min(1, "Please select an export format"),
});

export const ReportTemplateForm = () => {
  const { toast } = useToast();
  const user = useUser();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: "",
      reportType: "",
      format: "pdf",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create report templates",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('report_templates').insert({
        name: values.templateName,
        type: values.reportType,
        created_by: user.id,
        config: {
          format: values.format,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report template created successfully",
        className: "bg-green-50 border-green-200",
      });

      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create report template",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="templateName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Template Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter template name"
                  className="border-purple-light focus:border-purple bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reportType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Report Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-purple-light focus:border-purple bg-white text-foreground">
                    <SelectValue placeholder="Select report type" className="text-foreground" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white shadow-lg">
                  <SelectItem value="sales" className="hover:bg-purple-50 text-foreground">Sales Report</SelectItem>
                  <SelectItem value="users" className="hover:bg-purple-50 text-foreground">User Activity Report</SelectItem>
                  <SelectItem value="books" className="hover:bg-purple-50 text-foreground">Book Analytics Report</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Export Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-purple-light focus:border-purple bg-white text-foreground">
                    <SelectValue placeholder="Select format" className="text-foreground" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white shadow-lg">
                  <SelectItem value="pdf" className="hover:bg-purple-50 text-foreground">PDF</SelectItem>
                  <SelectItem value="excel" className="hover:bg-purple-50 text-foreground">Excel</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button 
            type="submit" 
            className="flex-1 bg-purple hover:bg-purple/90"
            disabled={!user}
          >
            Create Template
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 bg-white hover:bg-purple-50 border-purple-light"
            onClick={() => form.reset()}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </form>
    </Form>
  );
};