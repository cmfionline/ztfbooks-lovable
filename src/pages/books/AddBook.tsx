import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch existing data
  const { data: series = [] } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const { data } = await supabase.from("series").select("*");
      return data?.map(s => ({ value: s.id, label: s.name })) || [];
    },
  });

  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data } = await supabase.from("authors").select("*");
      return data?.map(a => ({ value: a.id, label: a.name })) || [];
    },
  });

  const { data: publishers = [] } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const { data } = await supabase.from("publishers").select("*");
      return data?.map(p => ({ value: p.id, label: p.name })) || [];
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await supabase.from("tags").select("*");
      return data?.map(t => ({ value: t.id, label: t.name })) || [];
    },
  });

  const { data: languages = [] } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await supabase.from("languages").select("*");
      return data?.map(l => ({ value: l.id, label: l.name })) || [];
    },
  });

  // Create new entities mutations
  const createSeries = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("series")
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });

  const createAuthor = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("authors")
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
  });

  const createPublisher = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("publishers")
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers"] });
    },
  });

  const createTag = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("tags")
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

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

      // Create book
      const { data: book, error: bookError } = await supabase
        .from("books")
        .insert({
          ...values,
          cover_image: coverImagePath,
          epub_file: epubFilePath,
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
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Add New Book</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Series</FormLabel>
                <FormControl>
                  <CreatableCombobox
                    value={field.value}
                    options={series}
                    onChange={field.onChange}
                    onCreateOption={async (name) => {
                      const newSeries = await createSeries.mutateAsync(name);
                      field.onChange(newSeries.id);
                    }}
                    placeholder="Select or create a series"
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
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <CreatableCombobox
                    value={field.value}
                    options={languages}
                    onChange={field.onChange}
                    onCreateOption={() => {}}
                    placeholder="Select a language"
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
                <FormLabel>Cover Image (300x450)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="synopsis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Synopsis</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Tags</FormLabel>
            <CreatableCombobox
              options={tags}
              onChange={(value) => {
                if (!selectedTags.includes(value)) {
                  setSelectedTags([...selectedTags, value]);
                }
              }}
              onCreateOption={async (name) => {
                const newTag = await createTag.mutateAsync(name);
                setSelectedTags([...selectedTags, newTag.id]);
              }}
              placeholder="Select or create tags"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tagId) => {
                const tag = tags.find((t) => t.value === tagId);
                return (
                  <Button
                    key={tagId}
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedTags(selectedTags.filter((id) => id !== tagId));
                    }}
                  >
                    {tag?.label} ×
                  </Button>
                );
              })}
            </div>
          </FormItem>

          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <CreatableCombobox
                    value={field.value}
                    options={authors}
                    onChange={field.onChange}
                    onCreateOption={async (name) => {
                      const newAuthor = await createAuthor.mutateAsync(name);
                      field.onChange(newAuthor.id);
                    }}
                    placeholder="Select or create an author"
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
                <FormLabel>Publisher</FormLabel>
                <FormControl>
                  <CreatableCombobox
                    value={field.value}
                    options={publishers}
                    onChange={field.onChange}
                    onCreateOption={async (name) => {
                      const newPublisher = await createPublisher.mutateAsync(name);
                      field.onChange(newPublisher.id);
                    }}
                    placeholder="Select or create a publisher"
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
                <FormLabel>EPUB File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".epub"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
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
                <FormLabel>Publication Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
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

          <FormField
            control={form.control}
            name="pageCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                <FormLabel>Pricing</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={field.value ? "default" : "outline"}
                      onClick={() => field.onChange(true)}
                    >
                      Free
                    </Button>
                    <Button
                      type="button"
                      variant={!field.value ? "default" : "outline"}
                      onClick={() => field.onChange(false)}
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit">Create Book</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddBook;