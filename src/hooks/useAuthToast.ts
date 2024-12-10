import { useToast } from '@/components/ui/use-toast';
import { AuthError } from '@supabase/supabase-js';

export const useAuthToast = () => {
  const { toast } = useToast();

  const showSuccessToast = (title: string, description: string) => {
    toast({ title, description });
  };

  const showErrorToast = (error: AuthError | Error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  };

  return { showSuccessToast, showErrorToast };
};