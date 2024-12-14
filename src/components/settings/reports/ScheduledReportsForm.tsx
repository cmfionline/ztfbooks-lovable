import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  templateId: z.string().min(1, "Please select a template"),
  schedule: z.string().min(1, "Please select a schedule"),
});

export const ScheduledReportsForm = () => {
  const { toast } = useToast();
  
  const { data: templates = [] } = useQuery({
    queryKey: ['reportTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateId: "",
      schedule: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.from('scheduled_reports').insert({
        template_id: values.templateId,
        schedule: values.schedule,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report scheduled successfully",
        className: "bg-green-50 border-green-200",
      });

      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to schedule report",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Report Template</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-purple-light focus:border-purple bg-white">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white shadow-lg">
                  {templates.map((template) => (
                    <SelectItem 
                      key={template.id} 
                      value={template.id}
                      className="hover:bg-purple-50"
                    >
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Schedule</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-purple-light focus:border-purple bg-white">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white shadow-lg">
                  <SelectItem value="daily" className="hover:bg-purple-50">Daily</SelectItem>
                  <SelectItem value="weekly" className="hover:bg-purple-50">Weekly</SelectItem>
                  <SelectItem value="monthly" className="hover:bg-purple-50">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full mt-4 bg-purple hover:bg-purple/90"
        >
          Schedule Report
        </Button>
      </form>
    </Form>
  );
};