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
  const { series, authors, publishers, tags, languages, isLoading } = useBookFormData({
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      seriesId: undefined,
      languageId: undefined,
      authorId: undefined,
      publisherId: undefined,
      synopsis: "",
      isFree: false,
      price: undefined,
      tags: [],
      ...initialData,
    },
  });

  const handleSubmit = async (values: BookFormValues) => {
    try {
      await onSubmit(values);
      toast({
        title: "Success",
        description: "Book has been saved successfully",
      });
    } catch (error) {
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

  return (
    <BookErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <BookBasicInfo
            control={form.control}
            series={series}
            languages={languages}
          />
          <BookMetadata
            control={form.control}
            authors={authors}
            publishers={publishers}
          />
          <BookFiles 
            control={form.control}
          />
          <BookTags
            selectedTags={form.watch("tags") || []}
            setSelectedTags={(tags) => form.setValue("tags", tags)}
            tags={tags}
          />
          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple/90"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {submitLabel}
          </Button>
        </form>
      </Form>
    </BookErrorBoundary>
  );
};