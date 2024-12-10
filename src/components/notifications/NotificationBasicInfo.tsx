import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NotificationBasicInfoProps {
  title: string;
  message: string;
  imageUrl: string;
  onTitleChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
}

export const NotificationBasicInfo = ({
  title,
  message,
  imageUrl,
  onTitleChange,
  onMessageChange,
  onImageUrlChange,
}: NotificationBasicInfoProps) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-border">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter notification title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Enter notification message"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="Enter image URL"
        />
      </div>
    </div>
  );
};