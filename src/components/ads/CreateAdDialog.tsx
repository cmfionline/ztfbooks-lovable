import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const adSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["banner", "interstitial", "popup", "sponsored"]),
  placement: z.enum(["home", "category", "checkout", "series", "book"]),
  content: z.string().min(1, "Content is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  cta_text: z.string().optional(),
});

type AdFormValues = z.infer<typeof adSchema>;

interface CreateAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateAdDialog = ({ open, onOpenChange }: CreateAdDialogProps) => {
  const queryClient = useQueryClient();
  
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: "",
      type: "banner",
      placement: "home",
      content: "",
      cta_text: "Learn More",
    },
  });

  const onSubmit = async (values: AdFormValues) => {
    const { error } = await supabase
      .from('ads')
      .insert([values]);

    if (error) {
      toast({
        title: "Error creating ad",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ad created",
      description: "The ad has been successfully created.",
    });

    queryClient.invalidateQueries({ queryKey: ['ads'] });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Advertisement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ad type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="interstitial">Interstitial</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="sponsored">Sponsored</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select placement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="checkout">Checkout</SelectItem>
                      <SelectItem value="series">Series</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cta_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Action Text</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Ad</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdDialog;