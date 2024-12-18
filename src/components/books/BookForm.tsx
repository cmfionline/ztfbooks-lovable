import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookBasicInfo } from "./components/BookBasicInfo";
import { BookMetadata } from "./components/BookMetadata";
import { BookFiles } from "./components/BookFiles";
import { BookTags } from "./components/BookTags";
import { bookSchema, type BookFormValues } from "@/pages/books/schema";
import { useBookFormData } from "@/hooks/useBookFormData";
import { BookErrorBoundary } from "./BookErrorBoundary";
import { BookLoadingState } from "./BookLoadingState";

interface BookFormProps {
  initialData?: Partial<BookFormValues>;
  onSubmit: (values: BookFormValues) => Promise<void>;
  submitLabel?: string;
}

export const BookForm = ({
  initialData,
  onSubmit,
  submitLabel = "Save Book",
}: BookFormProps) => {
  const { toast } = useToast();
  const { 
    series = [], 
    authors = [], 
    publishers = [], 
    tags = [], 
    languages = [], 
    isLoading,
    error 
  } = useBookFormData({
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: initialData?.title || "",
      seriesId: initialData?.seriesId,
      languageId: initialData?.languageId,
      authorId: initialData?.authorId,
      publisherId: initialData?.publisherId,
      synopsis: initialData?.synopsis || "",
      isFree: initialData?.isFree || false,
      hasDiscount: initialData?.hasDiscount || false,
      price: initialData?.price,
      discount_percentage: initialData?.discount_percentage,
      discount_start_date: initialData?.discount_start_date ? new Date(initialData.discount_start_date) : undefined,
      discount_end_date: initialData?.discount_end_date ? new Date(initialData.discount_end_date) : undefined,
      tags: initialData?.tags || [],
      publicationDate: initialData?.publicationDate ? new Date(initialData.publicationDate) : undefined,
      pageCount: initialData?.pageCount,
      ...initialData,
    },
    mode: "onChange",
  });

  const handleSubmit = async (values: BookFormValues) => {
    try {
      await onSubmit(values);
      toast({
        title: "Success",
        description: "Book has been saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving book:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save book. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <BookLoadingState />;
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load form data. Please try again.",
      variant: "destructive",
    });
    return null;
  }

  const isFormValid = form.formState.isValid;

  return (
    <BookErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
            <div className="space-y-6">
              <BookBasicInfo
                control={form.control}
                series={series}
                languages={languages}
              />
              <BookFiles control={form.control} />
            </div>
            <div className="space-y-6">
              <BookMetadata
                control={form.control}
                authors={authors}
                publishers={publishers}
              />
              <BookTags
                selectedTags={form.watch("tags") || []}
                setSelectedTags={(tags) => form.setValue("tags", tags)}
                tags={tags}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple/90 text-white font-semibold py-3 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={form.formState.isSubmitting || !isFormValid}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {submitLabel}
          </Button>
        </form>
      </Form>
    </BookErrorBoundary>
  );
};