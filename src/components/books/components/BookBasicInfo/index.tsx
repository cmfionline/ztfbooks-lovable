import { Control } from "react-hook-form";
import { TitleField } from "./TitleField";
import { SeriesField } from "./SeriesField";
import { LanguageField } from "./LanguageField";
import { SynopsisField } from "./SynopsisField";

interface BookBasicInfoProps {
  control: Control<any>;
  series: { label: string; value: string; }[];
  languages: { label: string; value: string; }[];
}

export const BookBasicInfo = ({
  control,
  series = [],
  languages = [],
}: BookBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <TitleField control={control} />
      <SeriesField control={control} series={series} />
      <LanguageField control={control} languages={languages} />
      <SynopsisField control={control} />
    </div>
  );
};