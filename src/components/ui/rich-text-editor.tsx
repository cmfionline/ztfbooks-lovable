import { cn } from "@/lib/utils";
import { Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, Link } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RichTextEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({
  value,
  onChange,
  className,
  ...props
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleFormat = (tag: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = value;
    if (tag === 'link') {
      if (!linkUrl) return;
      newText = value.substring(0, start) + 
        `<a href="${linkUrl}">${selectedText}</a>` +
        value.substring(end);
      setLinkUrl("");
    } else {
      newText = value.substring(0, start) + 
        `<${tag}>${selectedText}</${tag}>` +
        value.substring(end);
    }
    
    onChange(newText);
  };

  const handleSelection = () => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    setSelectionStart(textarea.selectionStart);
    setSelectionEnd(textarea.selectionEnd);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 bg-white p-1 border rounded-md">
        <Toggle size="sm" onClick={() => handleFormat('b')} aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => handleFormat('i')} aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => handleFormat('ul')} aria-label="Toggle list">
          <List className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Toggle size="sm" onClick={() => handleFormat('div class="text-left"')} aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => handleFormat('div class="text-center"')} aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onClick={() => handleFormat('div class="text-right"')} aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Button 
                onClick={() => handleFormat('link')}
                className="bg-purple hover:bg-purple/90"
              >
                Insert Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelection}
        className={cn(
          "flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
}