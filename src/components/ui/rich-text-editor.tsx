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
import { useState, useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  className,
  placeholder,
  ...props
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleFormat = useCallback((tag: string) => {
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
  }, [value, onChange, linkUrl]);

  const handleSelection = useCallback(() => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    setSelectionStart(textarea.selectionStart);
    setSelectionEnd(textarea.selectionEnd);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 bg-white p-1 border rounded-md">
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('b')} 
          aria-label="Toggle bold"
          className="hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <Bold className="h-5 w-5" />
        </Toggle>
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('i')} 
          aria-label="Toggle italic"
          className="hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <Italic className="h-5 w-5" />
        </Toggle>
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('ul')} 
          aria-label="Toggle list"
          className="hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <List className="h-5 w-5" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('div class="text-left"')} 
          aria-label="Align left"
          className="hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <AlignLeft className="h-5 w-5" />
        </Toggle>
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('div class="text-center"')} 
          aria-label="Align center"
          className="hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <AlignCenter className="h-5 w-5" />
        </Toggle>
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('div class="text-right"')} 
          aria-label="Align right"
          className="hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <AlignRight className="h-5 w-5" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 hover:bg-purple/20 hover:text-purple"
            >
              <Link className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="border-gray-200 focus:border-purple"
              />
              <Button 
                onClick={() => handleFormat('link')}
                className="bg-purple hover:bg-purple/90 text-white"
              >
                Insert Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        onSelect={handleSelection}
        className={cn(
          "flex min-h-[200px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}