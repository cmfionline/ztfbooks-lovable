import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookTagsProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  tags: { label: string; value: string }[];
}

export const BookTags = ({
  selectedTags,
  setSelectedTags,
  tags,
}: BookTagsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel className="text-primary">Tags</FormLabel>
        <Link 
          to="/books/tags/add"
          className="text-sm text-purple hover:text-purple-dark flex items-center gap-1"
        >
          <PlusCircle className="w-4 h-4" />
          Add Tag
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tagId) => {
          const tag = tags.find((t) => t.value === tagId);
          return tag ? (
            <span
              key={tagId}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-light text-purple"
            >
              {tag.label}
              <button
                type="button"
                onClick={() => {
                  setSelectedTags(selectedTags.filter((id) => id !== tagId));
                }}
                className="ml-2 hover:text-purple-600"
              >
                ×
              </button>
            </span>
          ) : null;
        })}
      </div>
      <Select
        onValueChange={(value) => {
          if (!selectedTags.includes(value)) {
            setSelectedTags([...selectedTags, value]);
          }
        }}
      >
        <SelectTrigger className="border-purple-light focus:border-purple">
          <SelectValue placeholder="Select tags" />
        </SelectTrigger>
        <SelectContent>
          {tags
            .filter((tag) => !selectedTags.includes(tag.value))
            .map((tag) => (
              <SelectItem key={tag.value} value={tag.value}>
                {tag.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};