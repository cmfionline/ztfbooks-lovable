import { useAdForm } from "./hooks/useAdForm";
import { AdFormLayout } from "./components/AdFormLayout";
import { AuthCheck } from "./components/AuthCheck";

interface AdFormProps {
  onSuccess: () => void;
}

export const AdForm = ({ onSuccess }: AdFormProps) => {
  const { form, isAuthenticated, onSubmit } = useAdForm({ onSuccess });

  if (!isAuthenticated) {
    return <AuthCheck />;
  }

  return (
    <AdFormLayout
      control={form.control}
      isSubmitting={form.formState.isSubmitting}
      onSubmit={form.handleSubmit(onSubmit)}
      form={form}
    />
  );
};