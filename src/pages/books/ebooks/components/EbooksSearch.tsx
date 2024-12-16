import { SearchInput } from "@/components/ui/search-input";

interface EbooksSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const EbooksSearch = ({ value, onChange }: EbooksSearchProps) => {
  return (
    <div className="mb-6">
      <SearchInput
        value={value}
        onChange={onChange}
        placeholder="Search by title, author, language, publisher, or series..."
      />
    </div>
  );
};