import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useBookFormData } from "@/hooks/useBookFormData";
import { FileUploadField } from "@/components/books/FileUploadField";
import { PricingFields } from "@/components/books/PricingFields";
import { BookBasicInfo } from "./BookBasicInfo";
import { BookMetadata } from "./BookMetadata";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  is_free: z.boolean().default(false),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  series_id: z.string().optional(),
  author_id: z.string(),
  publisher_id: z.string(),
  tags: z.array(z.string()),
  language_id: z.string(),
  cover_image: z.any().optional(),
  epub_file: z.any().optional(),
});

export type BookFormValues = z.infer<typeof formSchema>;

interface BookFormProps {
  onSubmit: (values: BookFormValues) => Promise<void>;
  onCancel: () => void;
}

export const BookForm = ({ onSubmit, onCancel }: BookFormProps) => {
  const { series, authors, publishers, tags, languages, isLoading } = useBookFormData();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      is_free: false,
      price: 0,
      series_id: undefined,
      author_id: "",
      publisher_id: "",
      tags: [],
      language_id: "",
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BookBasicInfo
          control={form.control}
          series={series}
          languages={languages}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadField
            control={form.control}
            name="cover_image"
            label="Cover Image"
            accept="image/*"
            helperText="Recommended size: 300x450 pixels"
          />

          <FileUploadField
            control={form.control}
            name="epub_file"
            label="EPUB File"
            accept=".epub"
          />
        </div>

        <PricingFields control={form.control} />

        <BookMetadata
          control={form.control}
          authors={authors}
          publishers={publishers}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-purple hover:bg-purple/90 text-white"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Add Book"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};