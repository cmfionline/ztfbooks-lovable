import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

type TicketFormData = {
  subject: string;
  description: string;
  category: string;
  priority: string;
};

// Define categories as a constant to make them more maintainable
const TICKET_CATEGORIES = [
  { value: "technical", label: "Technical Issue" },
  { value: "billing", label: "Billing" },
  { value: "account", label: "Account" },
  { value: "book_access", label: "Book Access" },
  { value: "payment", label: "Payment" },
  { value: "other", label: "Other" },
] as const;

const TICKET_PRIORITIES = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
] as const;

const NewTicketPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TicketFormData>({
    defaultValues: {
      category: "technical",
      priority: "medium",
    }
  });

  const onSubmit = async (data: TicketFormData) => {
    try {
      setIsSubmitting(true);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase
        .from("support_tickets")
        .insert([
          {
            user_id: userData.user.id,
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
          className="mb-4 hover:bg-purple/10"
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <Input
                {...register("subject", { 
                  required: "Please enter a subject for your ticket",
                  minLength: {
                    value: 5,
                    message: "Subject must be at least 5 characters long"
                  }
                })}
                placeholder="Brief description of your issue"
                className="w-full border-purple/20 focus:border-purple"
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue="technical"
              >
                <SelectTrigger className="w-full border-purple/20 focus:border-purple">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_CATEGORIES.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                      className="cursor-pointer hover:bg-purple/10"
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <Select
                onValueChange={(value) => setValue("priority", value)}
                defaultValue="medium"
              >
                <SelectTrigger className="w-full border-purple/20 focus:border-purple">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_PRIORITIES.map((priority) => (
                    <SelectItem 
                      key={priority.value} 
                      value={priority.value}
                      className="cursor-pointer hover:bg-purple/10"
                    >
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                {...register("description", {
                  required: "Please describe your issue",
                  minLength: {
                    value: 20,
                    message: "Description must be at least 20 characters long"
                  }
                })}
                placeholder="Please provide as much detail as possible about your issue"
                className="min-h-[150px] border-purple/20 focus:border-purple"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/support")}
                className="border-purple hover:bg-purple/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple hover:bg-purple-600 text-white min-w-[120px] transition-all duration-200"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewTicketPage;