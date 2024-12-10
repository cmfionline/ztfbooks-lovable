import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookFormData } from "@/hooks/useBookFormData";
import { BookBasicInfo } from "./components/BookBasicInfo";
import { BookFiles } from "./components/BookFiles";
import { BookMetadata } from "./components/BookMetadata";
import { BookTags } from "./components/BookTags";
import { Skeleton } from "@/components/ui/skeleton";

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
    series = [],
    authors = [],
    publishers = [],
    tags = [],
    languages = [],
    isLoading,
  } = useBookFormData();

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

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Add New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Add New Book</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BookBasicInfo
                control={form.control}
                series={series}
                languages={languages}
              />

              <BookFiles control={form.control} />

              <BookTags
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                tags={tags}
              />

              <BookMetadata
                control={form.control}
                authors={authors}
                publishers={publishers}
              />

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