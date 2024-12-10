import { Control } from "react-hook-form";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";

interface BookTagsProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  tags: { label: string; value: string; }[];
  onCreateTag: (name: string) => Promise<{ id: string } | undefined>;
}

export const BookTags = ({
  selectedTags,
  setSelectedTags,
  tags,
  onCreateTag,
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
          return (
            <span
              key={tagId}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-light text-purple"
            >
              {tag?.label}
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
          );
        })}
      </div>
      <CreatableCombobox
        options={tags}
        onChange={(value) => {
          if (!selectedTags.includes(value)) {
            setSelectedTags([...selectedTags, value]);
          }
        }}
        onCreateOption={async (name) => {
          const newTag = await onCreateTag(name);
          if (newTag?.id) setSelectedTags([...selectedTags, newTag.id]);
        }}
        placeholder="Select or create tags"
        className="border-purple-light focus:border-purple"
      />
    </div>
  );
};