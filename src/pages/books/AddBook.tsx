import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookFormData } from "@/hooks/useBookFormData";
import { useEntityMutations } from "@/hooks/useEntityMutations";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  seriesId: z.string().optional(),
  languageId: z.string(),
  coverImage: z.any().optional(),
  synopsis: z.string().min(1, "Synopsis is required"),
  authorId: z.string(),
  publisherId: z.string().optional(),
  epubFile: z.any().optional(),
  publicationDate: z.date().optional(),
  pageCount: z.number().min(1, "Page count must be at least 1"),
  isFree: z.boolean(),
  price: z.number().optional(),
});

const AddBook = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    series,
    authors,
    publishers,
    tags,
    languages,
  } = useBookFormData();

  const {
    createSeries,
    createAuthor,
    createPublisher,
    createTag,
  } = useEntityMutations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      synopsis: "",
      pageCount: 0,
      isFree: false,
      price: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Handle file uploads first
      let coverImagePath = null;
      let epubFilePath = null;

      if (values.coverImage) {
        const coverFile = values.coverImage[0];
        const { data: coverData, error: coverError } = await supabase.storage
          .from("books")
          .upload(`covers/${Date.now()}-${coverFile.name}`, coverFile);
        
        if (coverError) throw coverError;
        coverImagePath = coverData.path;
      }

      if (values.epubFile) {
        const epubFile = values.epubFile[0];
        const { data: epubData, error: epubError } = await supabase.storage
          .from("books")
          .upload(`epubs/${Date.now()}-${epubFile.name}`, epubFile);
        
        if (epubError) throw epubError;
        epubFilePath = epubData.path;
      }

      // Create book with properly mapped field names
      const { data: book, error: bookError } = await supabase
        .from("books")
        .insert({
          title: values.title,
          series_id: values.seriesId,
          language_id: values.languageId,
          cover_image: coverImagePath,
          synopsis: values.synopsis,
          author_id: values.authorId,
          publisher_id: values.publisherId,
          epub_file: epubFilePath,
          publication_date: values.publicationDate?.toISOString(),
          page_count: values.pageCount,
          is_free: values.isFree,
          price: values.price,
        })
        .select()
        .single();

      if (bookError) throw bookError;

      // Associate tags
      if (selectedTags.length > 0) {
        const { error: tagsError } = await supabase
          .from("books_tags")
          .insert(
            selectedTags.map(tagId => ({
              book_id: book.id,
              tag_id: tagId,
            }))
          );

        if (tagsError) throw tagsError;
      }

      toast({
        title: "Success",
        description: "Book has been created successfully",
      });

      navigate("/books");
    } catch (error) {
      console.error("Error creating book:", error);
      toast({
        title: "Error",
        description: "Failed to create book. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Add New Book</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="border-purple-light focus:border-purple focus:ring-purple"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seriesId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Series</FormLabel>
                      <FormControl>
                        <CreatableCombobox
                          value={field.value}
                          options={series}
                          onChange={field.onChange}
                          onCreateOption={async (name) => {
                            const newSeries = await createSeries.mutateAsync(name);
                            field.onChange(newSeries?.id);
                          }}
                          placeholder="Select or create a series"
                          className="border-purple-light focus:border-purple"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Language</FormLabel>
                      <FormControl>
                        <CreatableCombobox
                          value={field.value}
                          options={languages}
                          onChange={field.onChange}
                          onCreateOption={() => {}}
                          placeholder="Select a language"
                          className="border-purple-light focus:border-purple"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Cover Image (300x450)</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            {...field}
                            className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="synopsis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Synopsis</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="min-h-[120px] border-purple-light focus:border-purple focus:ring-purple"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel className="text-primary">Tags</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t) => t.value === tagId);
                    return (
                      <span
                        key={tagId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-light text-purple"
                      >
                        {tag?.label}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTags(selectedTags.filter((id) => id !== tagId));
                          }}
                          className="ml-2 hover:text-purple-600"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
                <CreatableCombobox
                  options={tags}
                  onChange={(value) => {
                    if (!selectedTags.includes(value)) {
                      setSelectedTags([...selectedTags, value]);
                    }
                  }}
                  onCreateOption={async (name) => {
                    const newTag = await createTag.mutateAsync(name);
                    if (newTag?.id) setSelectedTags([...selectedTags, newTag.id]);
                  }}
                  placeholder="Select or create tags"
                  className="border-purple-light focus:border-purple"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Author</FormLabel>
                      <FormControl>
                        <CreatableCombobox
                          value={field.value}
                          options={authors}
                          onChange={field.onChange}
                          onCreateOption={async (name) => {
                            const newAuthor = await createAuthor.mutateAsync(name);
                            if (newAuthor?.id) field.onChange(newAuthor.id);
                          }}
                          placeholder="Select or create an author"
                          className="border-purple-light focus:border-purple"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publisherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Publisher</FormLabel>
                      <FormControl>
                        <CreatableCombobox
                          value={field.value}
                          options={publishers}
                          onChange={field.onChange}
                          onCreateOption={async (name) => {
                            const newPublisher = await createPublisher.mutateAsync(name);
                            if (newPublisher?.id) field.onChange(newPublisher.id);
                          }}
                          placeholder="Select or create a publisher"
                          className="border-purple-light focus:border-purple"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="epubFile"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="text-primary">EPUB File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".epub"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                          className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publicationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-primary">Publication Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal border-purple-light hover:bg-purple-light/50",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pageCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Page Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="border-purple-light focus:border-purple"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Pricing</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <Button
                            type="button"
                            variant={field.value ? "default" : "outline"}
                            onClick={() => field.onChange(true)}
                            className={cn(
                              field.value 
                                ? "bg-purple text-white hover:bg-purple/90" 
                                : "border-purple-light hover:bg-purple-light/50"
                            )}
                          >
                            Free
                          </Button>
                          <Button
                            type="button"
                            variant={!field.value ? "default" : "outline"}
                            onClick={() => field.onChange(false)}
                            className={cn(
                              !field.value 
                                ? "bg-purple text-white hover:bg-purple/90" 
                                : "border-purple-light hover:bg-purple-light/50"
                            )}
                          >
                            Paid
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!form.watch("isFree") && (
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
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="border-purple-light focus:border-purple"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button 
                type="submit"
                className="w-full bg-purple hover:bg-purple/90 text-white"
              >
                Create Book
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBook;