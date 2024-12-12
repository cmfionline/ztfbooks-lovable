import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useBookFormData } from "@/hooks/useBookFormData";
import { FileUploadField } from "@/components/books/FileUploadField";
import { PricingFields } from "@/components/books/PricingFields";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
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
      isbn: "",
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Title</FormLabel>
              <FormControl>
                <Input {...field} className="border-purple-light focus:border-purple focus:ring-purple" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="border-purple-light focus:border-purple focus:ring-purple" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">ISBN</FormLabel>
                <FormControl>
                  <Input {...field} className="border-purple-light focus:border-purple focus:ring-purple" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PricingFields control={form.control} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="series_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Series</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border border-purple-light rounded-md focus:border-purple focus:ring-purple"
                  >
                    <option value="">Select Series</option>
                    {series.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Author</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border border-purple-light rounded-md focus:border-purple focus:ring-purple"
                  >
                    <option value="">Select Author</option>
                    {authors.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="publisher_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Publisher</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border border-purple-light rounded-md focus:border-purple focus:ring-purple"
                  >
                    <option value="">Select Publisher</option>
                    {publishers.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Language</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border border-purple-light rounded-md focus:border-purple focus:ring-purple"
                  >
                    <option value="">Select Language</option>
                    {languages.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Tags</FormLabel>
              <FormControl>
                <select
                  multiple
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                  className="w-full border border-purple-light rounded-md focus:border-purple focus:ring-purple"
                >
                  {tags.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
