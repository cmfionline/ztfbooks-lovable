import { Control } from "react-hook-form";
import { BookMetadataAuthor } from "./BookMetadataAuthor";
import { BookMetadataDate } from "./BookMetadataDate";
import { BookMetadataLanguage } from "./BookMetadataLanguage";
import { BookMetadataPrice } from "./BookMetadataPrice";
import { BookMetadataPublisher } from "./BookMetadataPublisher";

interface BookMetadataProps {
  control: Control<any>;
}

export const BookMetadata = ({ control }: BookMetadataProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BookMetadataAuthor control={control} />
      <BookMetadataPublisher control={control} />
      <BookMetadataLanguage control={control} />
      <BookMetadataDate control={control} />
      <BookMetadataPrice control={control} />
    </div>
  );
};