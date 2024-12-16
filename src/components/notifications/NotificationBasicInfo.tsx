import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const basicInfoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must not exceed 100 characters"),
  message: z.string().min(1, "Message is required").max(500, "Message must not exceed 500 characters"),
  imageUrl: z.string().url().optional(),
});

type BasicInfoProps = {
  title: string;
  message: string;
  imageUrl: string;
  onTitleChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
};

export const NotificationBasicInfo = ({
  title,
  message,
  imageUrl,
  onTitleChange,
  onMessageChange,
  onImageUrlChange,
}: BasicInfoProps) => {
  const validateField = (
    field: "title" | "message" | "imageUrl",
    value: string
  ): string | null => {
    try {
      basicInfoSchema.shape[field].parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message;
      }
      return "Invalid input";
    }
  };

  const handleTitleChange = (value: string) => {
    const error = validateField("title", value);
    if (!error || value === "") {
      onTitleChange(value);
    }
  };

  const handleMessageChange = (value: string) => {
    const error = validateField("message", value);
    if (!error || value === "") {
      onMessageChange(value);
    }
  };

  const handleImageUrlChange = (value: string) => {
    const error = validateField("imageUrl", value);
    if (!error || value === "") {
      onImageUrlChange(value);
    }
  };

  return (
    <div className="space-y-3 bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-purple-light/50">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-primary">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter notification title"
          className="border-purple-light/50 focus:border-purple focus:ring-purple"
          required
          maxLength={100}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-primary">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="Enter notification message"
          className="border-purple-light/50 focus:border-purple focus:ring-purple min-h-[100px]"
          required
          maxLength={500}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-sm font-medium text-primary">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          placeholder="Enter image URL"
          className="border-purple-light/50 focus:border-purple focus:ring-purple"
          type="url"
        />
      </div>
    </div>
  );
};