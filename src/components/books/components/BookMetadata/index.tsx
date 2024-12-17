import { Control } from "react-hook-form";
import { BookMetadataAuthor } from "./BookMetadataAuthor";
import { BookMetadataDate } from "./BookMetadataDate";
import { BookMetadataPrice } from "./BookMetadataPrice";
import { BookMetadataPublisher } from "./BookMetadataPublisher";

interface BookMetadataProps {
  control: Control<any>;
  authors: { label: string; value: string }[];
  publishers: { label: string; value: string }[];
}

export const BookMetadata = ({ control, authors = [], publishers = [] }: BookMetadataProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BookMetadataAuthor control={control} authors={authors} />
      <BookMetadataPublisher control={control} publishers={publishers} />
      <BookMetadataDate control={control} />
      <BookMetadataPrice control={control} />
    </div>
  );
};