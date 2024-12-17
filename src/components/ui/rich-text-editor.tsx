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
    const textarea = document.querySelector('.rich-text-area');
    if (!textarea) return;

    const start = (textarea as HTMLTextAreaElement).selectionStart;
    const end = (textarea as HTMLTextAreaElement).selectionEnd;
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
    const textarea = document.querySelector('.rich-text-area');
    if (!textarea) return;
    setSelectionStart((textarea as HTMLTextAreaElement).selectionStart);
    setSelectionEnd((textarea as HTMLTextAreaElement).selectionEnd);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-0.5 bg-white p-0.5 border rounded-md">
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('b')} 
          aria-label="Toggle bold"
          className="text-gray-700 hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('i')} 
          aria-label="Toggle italic"
          className="text-gray-700 hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('ul')} 
          aria-label="Toggle list"
          className="text-gray-700 hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-0.5 h-5" />
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('div class="text-left"')} 
          aria-label="Align left"
          className="text-gray-700 hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('div class="text-center"')} 
          aria-label="Align center"
          className="text-gray-700 hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle 
          size="sm" 
          onClick={() => handleFormat('div class="text-right"')} 
          aria-label="Align right"
          className="text-gray-700 hover:bg-purple/20 data-[state=on]:bg-purple/20 data-[state=on]:text-purple"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-0.5 h-5" />
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 px-2 text-gray-700 hover:bg-purple/20 hover:text-purple"
            >
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="border-gray-200 focus:border-purple h-8"
              />
              <Button 
                onClick={() => handleFormat('link')}
                className="bg-purple hover:bg-purple/90 text-white h-8"
              >
                Insert Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          onSelect={handleSelection}
          className={cn(
            "rich-text-area flex min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          placeholder={placeholder}
          {...props}
        />
        <div 
          className="absolute inset-0 pointer-events-none px-3 py-2 text-sm text-gray-900 overflow-auto"
          dangerouslySetInnerHTML={{ 
            __html: value.replace(/\n/g, '<br/>') 
          }}
          style={{ visibility: value ? 'visible' : 'hidden' }}
        />
      </div>
    </div>
  );
}