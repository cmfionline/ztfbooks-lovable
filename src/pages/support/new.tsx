import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CategorySelect } from "@/components/support/CategorySelect";
import { PrioritySelect } from "@/components/support/PrioritySelect";
import { NewTicketFormData } from "@/components/support/types";
import { useSession } from "@supabase/auth-helpers-react";

const NewTicketPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();

  const form = useForm<NewTicketFormData>({
    defaultValues: {
      subject: "",
      description: "",
      category: "technical",
      priority: "medium",
    },
    mode: "onBlur"
  });

  const onSubmit = async (data: NewTicketFormData) => {
    try {
      setIsSubmitting(true);
      
      if (!session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a ticket",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("support_tickets")
        .insert([
          {
            user_id: session.user.id,
            subject: data.subject,
            description: data.description,
            category: data.category,
            priority: data.priority,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your ticket has been submitted successfully.",
      });

      navigate("/support");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Button
          variant="ghost"
          className="mb-4 hover:bg-purple/10 text-foreground"
          onClick={() => navigate("/support")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>

        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple to-purple-light bg-clip-text text-transparent">
            Create New Support Ticket
          </h1>
          <p className="text-muted-foreground mt-2">
            Please provide details about your issue and we'll help you as soon as possible
          </p>
        </div>

        <Card className="p-6 shadow-lg border-purple/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                rules={{ 
                  required: "Please enter a subject for your ticket",
                  minLength: {
                    value: 5,
                    message: "Subject must be at least 5 characters long"
                  }
                }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-foreground">Subject</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Brief description of your issue"
                        className="w-full border-purple/20 focus:border-purple bg-white text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CategorySelect form={form} />
              <PrioritySelect form={form} />

              <FormField
                control={form.control}
                name="description"
                rules={{
                  required: "Please describe your issue",
                  minLength: {
                    value: 20,
                    message: "Description must be at least 20 characters long"
                  }
                }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-foreground">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Please provide as much detail as possible about your issue"
                        className="min-h-[150px] border-purple/20 focus:border-purple bg-white text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/support")}
                  className="border-purple hover:bg-purple/10 text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple hover:bg-purple/90 text-white min-w-[120px] transition-all duration-200"
                >
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default NewTicketPage;