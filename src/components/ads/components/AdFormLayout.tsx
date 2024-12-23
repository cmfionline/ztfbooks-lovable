import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Control, UseFormReturn } from "react-hook-form";
import { AdFormValues } from "../schema";
import { BasicInfoFields } from "../form/BasicInfoFields";
import { CreativeFields } from "../form/CreativeFields";
import { SchedulingFields } from "../form/SchedulingFields";
import { DiscountFields } from "../form/DiscountFields";

interface AdFormLayoutProps {
  control: Control<AdFormValues>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  form: UseFormReturn<AdFormValues>;
}

export const AdFormLayout = ({ control, isSubmitting, onSubmit, form }: AdFormLayoutProps) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="grid gap-6 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                  <BasicInfoFields control={control} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
                  <SchedulingFields control={control} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Creative Content</h3>
                  <CreativeFields control={control} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Discount Settings</h3>
                  <DiscountFields control={control} />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="min-w-[120px] bg-purple hover:bg-purple/90 text-white focus:ring-2 focus:ring-purple/50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Ad'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};