import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ButtonFields } from "./form/ButtonFields";
import { ConfigFields } from "./form/ConfigFields";
import { contentBlockSchema, ContentBlockFormProps, ContentBlockFormValues } from "./types";
import { useContentBlockMutation } from "./hooks/useContentBlockMutation";
import { FormHeader } from "./form/FormHeader";
import { FormSubmitButton } from "./form/FormSubmitButton";
import { AdminAccessCheck } from "./form/AdminAccessCheck";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

export const ContentBlockForm = ({ initialData, onSuccess }: ContentBlockFormProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const mutation = useContentBlockMutation(initialData?.id);
  
  const form = useForm<ContentBlockFormValues>({
    resolver: zodResolver(contentBlockSchema),
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      button_text: "",
      button_link: "",
      order_index: 0,
      is_active: true,
    },
  });

  const onSubmit = async (values: ContentBlockFormValues) => {
    if (!isAdmin) {
      return;
    }

    try {
      await mutation.mutateAsync(values);
      onSuccess?.();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <QueryErrorBoundary>
      <div className="space-y-6">
        <AdminAccessCheck onAccessGranted={setIsAdmin} />
        <FormHeader isEditing={!!initialData} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <BasicInfoFields form={form} />
              <ButtonFields form={form} />
              <ConfigFields form={form} />
            </div>

            <FormSubmitButton 
              isSubmitting={mutation.isPending} 
              isEditing={!!initialData}
            />
          </form>
        </Form>
      </div>
    </QueryErrorBoundary>
  );
};