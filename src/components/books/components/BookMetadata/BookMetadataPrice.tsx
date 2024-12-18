import { Control } from "react-hook-form";
import { PricingToggle } from "./BookMetadataPrice/PricingToggle";
import { PriceField } from "./BookMetadataPrice/PriceField";
import { DiscountFields } from "./BookMetadataPrice/DiscountFields";

interface BookMetadataPriceProps {
  control: Control<any>;
}

export const BookMetadataPrice = ({ control }: BookMetadataPriceProps) => {
  return (
    <>
      <PricingToggle control={control} />
      {!control._formValues.isFree && (
        <>
          <PriceField control={control} />
          <DiscountFields control={control} />
        </>
      )}
    </>
  );
};