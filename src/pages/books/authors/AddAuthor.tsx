import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEntityMutations } from "@/hooks/useEntityMutations";
import { UserPlus, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s\-'.]+$/,
      "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
    )
    .transform((val) => val.trim()),
});

type FormValues = z.infer<typeof formSchema>;

const AddAuthor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createAuthor } = useEntityMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createAuthor.mutateAsync(values.name);
      toast({
        title: "Success",
        description: `Author "${values.name}" has been created successfully.`,
      });
      navigate("/books/authors");
    } catch (error) {
      console.error("Error creating author:", error);
      toast({
        title: "Error",
        description: "Failed to create author. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-purple-light">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Add New Author
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-purple-light focus:border-purple"
                        placeholder="Enter author's name"
                        autoFocus
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the author's full name as it should appear on their books.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/books/authors")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple hover:bg-purple/90 text-white"
                  disabled={createAuthor.isPending}
                >
                  {createAuthor.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Author"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddAuthor;