import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Book, Loader2 } from "lucide-react";
import { useBookFormData } from "@/hooks/useBookFormData";
import { NotifyNewBook } from "@/components/books/NotifyNewBook";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  series_id: z.string().optional(),
  author_id: z.string(),
  publisher_id: z.string(),
  tags: z.array(z.string()),
  language_id: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const AddBook = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { series, authors, publishers, tags, languages, isLoading } = useBookFormData();
  const [newBook, setNewBook] = useState<any>(null);
  const [authorData, setAuthorData] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isbn: "",
      price: 0,
      series_id: undefined,
      author_id: "",
      publisher_id: "",
      tags: [],
      language_id: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: newBook, error } = await supabase
        .from("books")
        .insert([
          {
            title: values.title,
            description: values.description,
            isbn: values.isbn,
            price: values.price,
            series_id: values.series_id || null,
            author_id: values.author_id,
            publisher_id: values.publisher_id,
            tags: values.tags,
            language_id: values.language_id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const { data: authorData } = await supabase
        .from("authors")
        .select("name")
        .eq("id", values.author_id)
        .single();

      setNewBook(newBook);
      setAuthorData(authorData);

      toast({
        title: "Success",
        description: "Book has been added successfully",
      });

      return (
        <div className="mt-4 flex justify-end">
          <NotifyNewBook
            bookTitle={values.title}
            bookId={newBook.id}
            authorName={authorData?.name || "Unknown Author"}
          />
        </div>
      );
    } catch (error: any) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add book. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Book className="w-6 h-6" />
              Add New Book
            </CardTitle>
          </CardHeader>
          <CardContent>
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

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="border-purple-light focus:border-purple focus:ring-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    onClick={() => navigate("/books")}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBook;