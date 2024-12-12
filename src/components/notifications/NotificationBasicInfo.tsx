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
    <div className="space-y-3 bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-purple-light/50">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-primary">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter notification title"
          className="border-purple-light/50 focus:border-purple focus:ring-purple"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-primary">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Enter notification message"
          className="border-purple-light/50 focus:border-purple focus:ring-purple min-h-[100px]"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-sm font-medium text-primary">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="Enter image URL"
          className="border-purple-light/50 focus:border-purple focus:ring-purple"
        />
      </div>
    </div>
  );
};